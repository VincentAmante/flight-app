import { z } from "zod"

export interface GetFlightsArgs {
    originSkyId: string
    destinationSkyId: string
    originEntityId: string
    destinationEntityId: string
    // date: YYYY-MM-DD
    // returnDate: YYYY-MM-DD
}

export interface QueryArgs {
    origin: string
    destination: string
    dateRange: {
        from: string
        to: string
    }
}

export const QuerySchema = z
    .object({
        origin: z
            .string()
            .min(1),
        destination: z
            .string()
            .min(1),
        dateRange: z.object({
            from: z
                .string()
                .date(),
            to: z
                .string()
                .date()
                .optional()
        })
    })
    .superRefine((val, ctx) => {
        if (val.dateRange.to && val.dateRange.from > val.dateRange.to) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Return date cannot be before departure",
                path: ['dateRange.to']
            })
        }
        if (val.origin === val.destination) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Destination cannot be the same as origin",
                path: ['destination']
            })
        }
    })

export type QuerySchemaType = z.infer<typeof QuerySchema>