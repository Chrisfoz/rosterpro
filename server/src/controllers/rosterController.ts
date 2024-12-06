import { Request, Response } from 'express';
import { rosterService } from '../services/rosterService';
import { ValidationError } from '../utils/errors';

export const rosterController = {
  async createRoster(req: Request, res: Response) {
    try {
      const { assignments } = req.body;
      const result = await rosterService.createRoster(assignments);
      res.json(result);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          error: error.message,
          conflicts: error.conflicts
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async getRoster(req: Request, res: Response) {
    try {
      const { date, serviceType } = req.query;
      const roster = await rosterService.getRosterByDate(
        date as string,
        serviceType as string
      );
      res.json(roster);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAvailableMembers(req: Request, res: Response) {
    try {
      const { date, roleId } = req.query;
      const members = await rosterService.getAvailableMembers(
        date as string,
        parseInt(roleId as string)
      );
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateRosterStatus(req: Request, res: Response) {
    try {
      const { rosterId } = req.params;
      const { status } = req.body;
      const updatedRoster = await rosterService.updateRosterStatus(
        parseInt(rosterId),
        status
      );
      res.json(updatedRoster);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
