import { NextResponse } from "next/server";

// Force dynamic rendering to avoid build-time API initialization
export const dynamic = 'force-dynamic';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req) {
    try {
        const { topic, category } = await req.json();

        if (!UNSPLASH_ACCESS_KEY) {
            console.warn('Unsplash API key not found, using fallback image');
            return NextResponse.json({
                imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=600&fit=crop",
                alt: `${topic} course image`
            });
        }

        // Create search query based on topic and category
        const searchQuery = `${topic} ${category} education learning technology`.replace(/\s+/g, ' ').trim();
        
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Get a random image from the top 5 results
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
            const selectedImage = data.results[randomIndex];
            
            return NextResponse.json({
                imageUrl: selectedImage.urls.regular,
                alt: selectedImage.alt_description || `${topic} course image`,
                photographer: selectedImage.user.name,
                photographerUrl: selectedImage.user.links.html
            });
        } else {
            // Fallback image if no results
            console.log('No Unsplash results found, using fallback');
            return NextResponse.json({
                imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=600&fit=crop",
                alt: `${topic} course image`
            });
        }
    } catch (error) {
        console.error('Error generating course image:', error);
        // Return fallback image on error
        return NextResponse.json({
            imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=600&fit=crop",
            alt: "Course image"
        });
    }
}
