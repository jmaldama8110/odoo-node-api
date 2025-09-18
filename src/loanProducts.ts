import { Router, Request, Response } from 'express';
import crypto from 'crypto';

// Types
export type RepaymentFrequency = 'monthly' | 'weekly';
export type TermUnit = 'days' | 'weeks' | 'months';

export interface LoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  annualInterestRate: number; // APR in percent (e.g., 12.5)
  allowedRepaymentFrequencies: RepaymentFrequency[];
  minTerm: number;
  maxTerm: number;
  termUnit: TermUnit;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// In-memory store (replace with DB later)
const loanProducts: LoanProduct[] = [];

// Validation
function validateLoanProductPayload(payload: any, isUpdate = false): string[] {
  const errors: string[] = [];

  const allowedFrequencies: RepaymentFrequency[] = ['monthly', 'weekly'];
  const allowedTermUnits: TermUnit[] = ['days', 'weeks', 'months'];

  const has = (k: string) => Object.prototype.hasOwnProperty.call(payload, k);
  const required = [
    'name',
    'minAmount',
    'maxAmount',
    'annualInterestRate',
    'allowedRepaymentFrequencies',
    'minTerm',
    'maxTerm',
    'termUnit',
  ];

  if (!isUpdate) {
    for (const key of required) {
      if (!has(key)) errors.push(`${key} is required`);
    }
  }

  if (has('name') && (typeof payload.name !== 'string' || payload.name.trim().length === 0)) {
    errors.push('name must be a non-empty string');
  }

  if (has('minAmount')) {
    const v = Number(payload.minAmount);
    if (!Number.isFinite(v) || v < 0) errors.push('minAmount must be a non-negative number');
  }
  if (has('maxAmount')) {
    const v = Number(payload.maxAmount);
    if (!Number.isFinite(v) || v <= 0) errors.push('maxAmount must be a positive number');
  }
  if (has('minAmount') && has('maxAmount')) {
    const min = Number(payload.minAmount);
    const max = Number(payload.maxAmount);
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) errors.push('minAmount cannot be greater than maxAmount');
  }

  if (has('annualInterestRate')) {
    const apr = Number(payload.annualInterestRate);
    if (!Number.isFinite(apr) || apr <= 0 || apr > 100) errors.push('annualInterestRate must be > 0 and <= 100');
  }

  if (has('allowedRepaymentFrequencies')) {
    if (!Array.isArray(payload.allowedRepaymentFrequencies) || payload.allowedRepaymentFrequencies.length === 0) {
      errors.push('allowedRepaymentFrequencies must be a non-empty array');
    } else {
      for (const f of payload.allowedRepaymentFrequencies) {
        if (!allowedFrequencies.includes(f)) errors.push(`Invalid repayment frequency: ${f}`);
      }
    }
  }

  if (has('minTerm')) {
    const v = Number(payload.minTerm);
    if (!Number.isFinite(v) || v <= 0) errors.push('minTerm must be a positive number');
  }
  if (has('maxTerm')) {
    const v = Number(payload.maxTerm);
    if (!Number.isFinite(v) || v <= 0) errors.push('maxTerm must be a positive number');
  }
  if (has('minTerm') && has('maxTerm')) {
    const min = Number(payload.minTerm);
    const max = Number(payload.maxTerm);
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) errors.push('minTerm cannot be greater than maxTerm');
  }

  if (has('termUnit') && !allowedTermUnits.includes(payload.termUnit)) {
    errors.push(`termUnit must be one of ${allowedTermUnits.join(', ')}`);
  }

  return errors;
}

function nowISO() { return new Date().toISOString(); }

const router = Router();

// Create
router.post('/', (req: Request, res: Response) => {
  const errors = validateLoanProductPayload(req.body);
  if (errors.length) return res.status(400).json({ error: 'ValidationError', details: errors });

  const exists = loanProducts.find(lp => lp.name.toLowerCase() === String(req.body.name).trim().toLowerCase());
  if (exists) return res.status(409).json({ error: 'Conflict', details: ['A loan product with this name already exists'] });

  const product: LoanProduct = {
    id: crypto.randomUUID(),
    name: String(req.body.name).trim(),
    minAmount: Number(req.body.minAmount),
    maxAmount: Number(req.body.maxAmount),
    annualInterestRate: Number(req.body.annualInterestRate),
    allowedRepaymentFrequencies: req.body.allowedRepaymentFrequencies as RepaymentFrequency[],
    minTerm: Number(req.body.minTerm),
    maxTerm: Number(req.body.maxTerm),
    termUnit: req.body.termUnit as TermUnit,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  loanProducts.push(product);
  return res.status(201).json(product);
});

// List
router.get('/', (_req: Request, res: Response) => {
  res.json({ items: loanProducts, total: loanProducts.length });
});

// Get by id
router.get('/:id', (req: Request, res: Response) => {
  const found = loanProducts.find(lp => lp.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'NotFound', details: ['Loan product not found'] });
  res.json(found);
});

// Update (full)
router.put('/:id', (req: Request, res: Response) => {
  const idx = loanProducts.findIndex(lp => lp.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'NotFound', details: ['Loan product not found'] });

  const errors = validateLoanProductPayload(req.body);
  if (errors.length) return res.status(400).json({ error: 'ValidationError', details: errors });

  const name = String(req.body.name).trim();
  const conflict = loanProducts.find(lp => lp.name.toLowerCase() === name.toLowerCase() && lp.id !== req.params.id);
  if (conflict) return res.status(409).json({ error: 'Conflict', details: ['Another loan product with this name already exists'] });

  const updated: LoanProduct = {
    ...loanProducts[idx],
    name,
    minAmount: Number(req.body.minAmount),
    maxAmount: Number(req.body.maxAmount),
    annualInterestRate: Number(req.body.annualInterestRate),
    allowedRepaymentFrequencies: req.body.allowedRepaymentFrequencies as RepaymentFrequency[],
    minTerm: Number(req.body.minTerm),
    maxTerm: Number(req.body.maxTerm),
    termUnit: req.body.termUnit as TermUnit,
    updatedAt: nowISO(),
  };

  loanProducts[idx] = updated;
  res.json(updated);
});

// Delete
router.delete('/:id', (req: Request, res: Response) => {
  const idx = loanProducts.findIndex(lp => lp.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'NotFound', details: ['Loan product not found'] });
  const [removed] = loanProducts.splice(idx, 1);
  res.json({ deleted: true, id: removed.id });
});

export default router;
