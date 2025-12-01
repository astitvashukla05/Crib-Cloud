import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cognitoId = req.params.cognitoId;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });

    if (!manager) {
      res.status(404).json({ message: 'manager Not Found' });
      return;
    }

    res.status(200).json({ data: manager });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving manager' });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cognitoId = req.body.cognitoId;
    const name = req.body.name;
    const email = req.body.email; // fixed
    const phoneNumber = req.body.phoneNumber;

    if (!cognitoId || !name || !email) {
      res.status(400).json({ message: 'Missing Creds' });
      return;
    }

    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json({ data: manager }); // fixed
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error Creating User' });
  }
};
