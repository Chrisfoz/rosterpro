import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  auth: {
    login: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  },
  roster: {
    assign: z.object({
      memberId: z.number(),
      roleId: z.number(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      serviceType: z.enum(['english', 'italian']),
    }),
    validate: z.object({
      assignments: z.array(
        z.object({
          memberId: z.number(),
          roleId: z.number(),
          date: z.string(),
          serviceType: z.enum(['english', 'italian']),
        })
      ),
    }),
  },
  availability: {
    update: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      isAvailable: z.boolean(),
      reason: z.string().optional(),
    }),
  },
  preferences: {
    update: z.object({
      maxServingFrequency: z.number().min(1).max(4),
      preferredRoles: z.array(z.number()),
      familyServePreference: z.enum(['together', 'separate', 'no-preference']),
      languageSkills: z.object({
        english: z.enum(['none', 'basic', 'fluent']),
        italian: z.enum(['none', 'basic', 'fluent']),
      }),
    }),
  },
};
