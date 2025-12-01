import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

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
    const email = req.body.email;
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
        phoneNumber: phoneNumber ?? null,
      },
    });

    res.status(201).json({ data: manager });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error Creating User' });
  }
};

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const existingManager = await prisma.manager.findUnique({
      where: { cognitoId },
    });

    if (!existingManager) {
      res.status(404).json({ message: 'Manager not found' });
      return;
    }

    const updatedManager = await prisma.manager.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber: phoneNumber ?? null,
      },
    });

    res.status(200).json({ data: updatedManager });
  } catch (error: any) {
    console.error('[updateManager] error:', error);
    res.status(500).json({ message: 'Error updating manager' });
  }
};

export const getManagerProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const properties = await prisma.property.findMany({
      where: { managerCognitoId: cognitoId },
      include: {
        location: true,
      },
    });

    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        // safe DB call - may return empty array
        const coordinatesResult: { coordinates?: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const wkt = coordinatesResult?.[0]?.coordinates ?? null;

        // Guard WKT -> GeoJSON parsing to avoid throwing on malformed data
        let longitude: number | null = null;
        let latitude: number | null = null;

        if (wkt && typeof wkt === 'string') {
          try {
            const geoJSON: any = wktToGeoJSON(wkt);
            // ensure coordinates exist and are in [lng, lat] order
            if (
              geoJSON &&
              Array.isArray(geoJSON.coordinates) &&
              geoJSON.coordinates.length >= 2
            ) {
              longitude = Number(geoJSON.coordinates[0]);
              latitude = Number(geoJSON.coordinates[1]);

              // if parsing produced NaN, reset to null
              if (Number.isNaN(longitude)) longitude = null;
              if (Number.isNaN(latitude)) latitude = null;
            }
          } catch (e) {
            // log but continue — we don't want a single bad WKT to crash the whole endpoint
            console.warn(
              `[getManagerProperties] failed to parse WKT for location id ${property.location.id}:`,
              e
            );
          }
        }

        return {
          ...property,
          location: {
            ...property.location,
            coordinates:
              longitude !== null && latitude !== null
                ? { longitude, latitude }
                : null,
          },
        };
      })
    );

    res.status(200).json(propertiesWithFormattedLocation);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
};
