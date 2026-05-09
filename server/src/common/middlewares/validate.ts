import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

type ValidationSource = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, source: ValidationSource = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source] ?? {};
      const parsed = await schema.parseAsync(dataToValidate);

      (req as any)[source] = parsed;

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return next(err);
    }
  };
