import { BatchService } from '../services/batch.service.js';
export const getBatches = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const batches = await BatchService.getByOrgId(orgId);
        res.json({ data: batches });
    }
    catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
};
export const createBatch = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const batch = await BatchService.create(orgId, req.body);
        res.status(201).json({ data: batch });
    }
    catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
};
export const updateBatch = async (req, res) => {
    try {
        const id = req.params.id;
        const batch = await BatchService.update(id, req.body);
        res.json({ data: batch });
    }
    catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
};
export const deleteBatch = async (req, res) => {
    try {
        const id = req.params.id;
        await BatchService.delete(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
};
//# sourceMappingURL=batch.controller.js.map