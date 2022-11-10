import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import { validationMessage } from 'Resources/locales/en-US/validation';

export default class ListValidator
{
    constructor (protected ctx: HttpContextContract)
    { }

    public schema = schema.create({
        pagination: schema.object.optional().members({
            page: schema.number.optional(),
            per_page_limit: schema.number.optional(),
        }),
        order: schema.object.optional().members({
            column: schema.string.optional(),
            columns: schema.array.optional().members(schema.string()),
            direction: schema.enum(
                ['asc', 'desc', 'ASC', 'DESC'] as const
            ),
        }),
        filters: schema.array.optional().members(
            schema.object.optional().members({
                column: schema.string({ trim: true }),
                operator: schema.string.optional({ trim: true }),
                value: schema.string({ trim: true }),
            }),
        ),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}
