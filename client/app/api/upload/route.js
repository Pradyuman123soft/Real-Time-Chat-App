import { writeFile } from 'fs/promises';
import { join } from 'path';

// create the API route
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Convert the file data to a Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filepath = join(process.cwd(), 'public', 'uploads', filename);

        // Write the file to the public/uploads directory
        await writeFile(filepath, buffer);

        return new Response(JSON.stringify({
            message: 'File uploaded successfully',
            filename: filename,
            filepath: `/uploads/${filename}`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({ error: `Upload failed: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}