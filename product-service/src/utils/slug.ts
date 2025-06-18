import slugify from 'slugify';
import { Model } from 'mongoose';

export function generateSlug(text: string): string {
    return slugify(text, {
        lower: true,
        strict: true,
        trim: true,
    });
}

export async function generateUniqueSlug(
    name: string,
    model: Model<any>,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(name);
    const regex = new RegExp(`^${baseSlug}(-\\d+)?$`, 'i');
    const query: any = { slug: { $regex: regex } };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await model.find(query, 'slug');
    const existingSlugs = existing.map((doc) => doc.slug);
    if (!existingSlugs.includes(baseSlug)) return baseSlug;

    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    while (existingSlugs.includes(newSlug)) {
        counter++;
        newSlug = `${baseSlug}-${counter}`;
    }

    return newSlug;
}