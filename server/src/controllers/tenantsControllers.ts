import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error: any) {
    console.error('[getTenant] error:', error);
    res
      .status(500)
      .json({ message: `Error retrieving tenant: ${error.message}` });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;

    if (!cognitoId || !name || !email) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber: phoneNumber ?? null,
      },
    });

    res.status(201).json(tenant);
  } catch (error: any) {
    console.error('[createTenant] error:', error);
    res
      .status(500)
      .json({ message: `Error creating tenant: ${error.message}` });
  }
};

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    if (!name || !email) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const existing = await prisma.tenant.findUnique({ where: { cognitoId } });
    if (!existing) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    const updateTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber: phoneNumber ?? null,
      },
    });

    res.json(updateTenant);
  } catch (error: any) {
    console.error('[updateTenant] error:', error);
    res
      .status(500)
      .json({ message: `Error updating tenant: ${error.message}` });
  }
};

export const getCurrentResidences = async (
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
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        // safe DB call - may return empty array
        const coordinatesResult: { coordinates?: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        const wkt = coordinatesResult?.[0]?.coordinates ?? null;

        // Guard WKT parsing
        let longitude: number | null = null;
        let latitude: number | null = null;

        if (wkt && typeof wkt === 'string') {
          try {
            const geoJSON: any = wktToGeoJSON(wkt);
            if (
              geoJSON &&
              Array.isArray(geoJSON.coordinates) &&
              geoJSON.coordinates.length >= 2
            ) {
              longitude = Number(geoJSON.coordinates[0]);
              latitude = Number(geoJSON.coordinates[1]);

              if (Number.isNaN(longitude)) longitude = null;
              if (Number.isNaN(latitude)) latitude = null;
            }
          } catch (e) {
            console.warn(
              `[getCurrentResidences] failed to parse WKT for location id ${property.location.id}:`,
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

    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    console.error('[getCurrentResidences] error:', err);
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const propertyIdNumber = Number(propertyId);
    if (Number.isNaN(propertyIdNumber)) {
      res.status(400).json({ message: 'Invalid propertyId' });
      return;
    }

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    const existingFavorites = tenant.favorites || [];

    if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            connect: { id: propertyIdNumber },
          },
        },
        include: { favorites: true },
      });
      res.json(updatedTenant);
    } else {
      res.status(409).json({ message: 'Property already added as favorite' });
    }
  } catch (error: any) {
    console.error('[addFavoriteProperty] error:', error);
    res
      .status(500)
      .json({ message: `Error adding favorite property: ${error.message}` });
  }
};

export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, propertyId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId param missing' });
      return;
    }

    const propertyIdNumber = Number(propertyId);
    if (Number.isNaN(propertyIdNumber)) {
      res.status(400).json({ message: 'Invalid propertyId' });
      return;
    }

    // optional: ensure tenant exists to return 404 if not found
    const tenant = await prisma.tenant.findUnique({ where: { cognitoId } });
    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          disconnect: { id: propertyIdNumber },
        },
      },
      include: { favorites: true },
    });

    res.json(updatedTenant);
  } catch (err: any) {
    console.error('[removeFavoriteProperty] error:', err);
    res
      .status(500)
      .json({ message: `Error removing favorite property: ${err.message}` });
  }
};
