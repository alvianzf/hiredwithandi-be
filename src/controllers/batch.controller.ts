import { Request, Response } from 'express';
import { BatchService } from '../services/batch.service.js';

export const getBatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.params.orgId as string;
    const batches = await BatchService.getByOrgId(orgId);
    res.json({ data: batches });
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.params.orgId as string;
    const batch = await BatchService.create(orgId, req.body);
    res.status(201).json({ data: batch });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
};

export const updateBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const batch = await BatchService.update(id, req.body);
    res.json({ data: batch });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
};

export const deleteBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await BatchService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
};
