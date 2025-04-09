import { z } from "zod"

export interface GetFlightsArgs {
    originSkyId: string
    destinationSkyId: string
    originEntityId: string
    destinationEntityId: string
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
            .min(1, "Origin is required"),
        destination: z
            .string()
            .min(1, "Destination is required"),
        dateRange: z.object({
            from: z
                .string()
                .date(),
            to: z
                .string()
                .date()
        }),
        cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).default('economy'),
        adults: z.string().optional(),
        childrens: z.string().optional(),
        infants: z.string().optional(),
        sortBy: z.enum(['best', 'price_high', 'cheapest', 'fastest', 'outbound_take_off_time', 'outbound_landing_time', 'return_take_off_time', 'return_landing_time']).default('best'),
        limit: z.string().default('0').optional(),
        carriersIds: z.string().optional(),
        currency: z.string().default('USD'),
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
