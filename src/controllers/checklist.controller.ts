import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../config/prisma.js';

export const getMyChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const progress = await prisma.checklistProgress.upsert({
      where: { userId },
      update: {}, // Provide empty object for update to satisfy Prisma schema
      create: {
        userId,
        state: {} // Empty JSON object initially
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isChecklistComplete: true }
    });

    res.json({
      data: {
        state: progress.state,
        isComplete: user?.isChecklistComplete || false
      }
    });
  } catch (error) {
    console.error('Get Checklist Error:', error);
    res.status(500).json({ error: 'Failed to fetch checklist progress' });
  }
};

export const updateMyChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { state } = req.body;

    // We expect the frontend to send the entire partial state object 
    // structured however it likes (e.g. grouped by category)
    if (!state || typeof state !== 'object') {
      res.status(400).json({ error: 'Invalid state object provided' });
      return;
    }

    const progress = await prisma.checklistProgress.upsert({
      where: { userId },
      update: { state },
      create: {
        userId,
        state
      }
    });

    await prisma.checklistLog.create({
      data: {
        checklistProgressId: progress.id,
        changes: state
      }
    });

    res.json({
      message: 'Checklist progress saved successfully',
      data: {
        state: progress.state
      }
    });
  } catch (error) {
    console.error('Update Checklist Error:', error);
    res.status(500).json({ error: 'Failed to save checklist progress' });
  }
};

export const completeMyChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Explicitly validate the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Set the boolean flag on the user
    await prisma.user.update({
      where: { id: userId },
      data: { isChecklistComplete: true }
    });

    res.json({
      message: 'Checklist marked as complete. Welcome to HiredWithAndi!',
      data: { isComplete: true }
    });
  } catch (error) {
    console.error('Complete Checklist Error:', error);
    res.status(500).json({ error: 'Failed to complete checklist' });
  }
};

export const getOrgChecklistStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;

    // The req.user.role logic should be handled by verifyRole(['ADMIN', 'SUPERADMIN']) middleware

    // Get all users in the org
    const orgUsers = await prisma.user.findMany({
      where: { orgId, role: 'MEMBER' },
      select: {
        id: true,
        name: true,
        email: true,
        isChecklistComplete: true,
        checklistProgress: {
          select: { state: true, updatedAt: true }
        }
      }
    });

    const total = orgUsers.length;
    const completed = orgUsers.filter(u => u.isChecklistComplete).length;
    const pending = total - completed;

    res.json({
      data: {
        stats: {
          total,
          completed,
          pending,
          completionRate: total > 0 ? (completed / total) * 100 : 0
        },
        members: orgUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          isCompleted: u.isChecklistComplete,
          lastUpdated: u.checklistProgress?.updatedAt || null,
          progressState: u.checklistProgress?.state || {}
        }))
      }
    });
  } catch (error) {
    console.error('Get Org Checklist Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch org checklist statistics' });
  }
};
