// server/src/controllers/tenantsControllers.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const cognitoId = req.params.cognitoId;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true }, // optional, remove if not present in schema
    });

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    // return in { data } shape to match fetchWithBQ expectations
    res.status(200).json({ data: tenant });
  } catch (error: any) {
    console.error('[getTenant] error:', error);
    res.status(500).json({ message: 'Error retrieving tenant' });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // destructure expected fields
    const { cognitoId, name, email, phoneNumber } = req.body;

    // basic validation
    if (!cognitoId || !name || !email) {
      res.status(400).json({
        message: 'Missing required fields: cognitoId, username, email',
      });
      return;
    }

    // avoid duplicates
    const existing = await prisma.tenant.findUnique({ where: { cognitoId } });
    if (existing) {
      res
        .status(409)
        .json({ message: 'Tenant already exists', data: existing });
      return;
    }

    // create tenant
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber: phoneNumber ?? null,
      },
    });

    // return created object in { data } shape
    res.status(201).json({ data: tenant });
  } catch (error: any) {
    console.error('[createTenant] error:', error);
    res.status(500).json({ message: 'Error creating tenant' });
  }
};
export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    // Validate inputs
    if (!cognitoId) {
      res.status(400).json({ message: 'Missing cognitoId parameter' });
      return;
    }

    if (!name || !email) {
      res.status(400).json({ message: 'Missing required fields: name, email' });
      return;
    }

    // Check if tenant exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { cognitoId },
    });

    if (!existingTenant) {
      res.status(404).json({ message: 'Tenant Not Found' });
      return;
    }

    // Update tenant
    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber: phoneNumber ?? null,
      },
    });

    // Return consistent format
    res.status(200).json({ data: updatedTenant });
  } catch (error: any) {
    console.error('[updateTenant] error:', error);
    res.status(500).json({ message: 'Error updating tenant' });
  }
};
