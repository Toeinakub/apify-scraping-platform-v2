/**
 * Image Helper Utilities
 * Functions to detect and handle image URLs from various scraping sources
 */

/**
 * Check if a URL is an image URL based on extension or common image CDN patterns
 */
export function isImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    // Parse URL to check extension
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();

    // Check for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i;
    if (imageExtensions.test(pathname)) {
      return true;
    }

    // Check for common image CDN patterns (Facebook, Instagram, etc.)
    const cdnPatterns = [
      /fbcdn\.net.*\/(v\/)?[^/]*\/(p|s|c)\d+x\d+\//i, // Facebook CDN
      /scontent.*\.fbcdn\.net/i, // Facebook scontent
      /cdninstagram\.com/i, // Instagram CDN
      /graph\.facebook\.com.*\/picture/i, // Facebook Graph API images
    ];

    return cdnPatterns.some((pattern) => pattern.test(url));
  } catch {
    return false;
  }
}

/**
 * Check if a field name suggests it contains image data
 */
export function isImageField(fieldName: string): boolean {
  const imageFieldPatterns = [
    /^image/i,
    /picture$/i,
    /photo$/i,
    /avatar$/i,
    /thumbnail$/i,
    /^img/i,
    /icon$/i,
    /logo$/i,
  ];

  return imageFieldPatterns.some((pattern) => pattern.test(fieldName));
}

/**
 * Extract image URLs from Facebook attachments field
 * Facebook attachments can be a JSON array or object containing image URLs
 */
export function extractImagesFromAttachments(attachments: any): string[] {
  const images: string[] = [];

  if (!attachments) return images;

  try {
    // Parse if string
    const data = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;

    // Handle array of attachments
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (!item || typeof item !== 'object') return;

        // Check for thumbnail field (Facebook Group, Facebook Post)
        if (item.thumbnail && typeof item.thumbnail === 'string' && isImageUrl(item.thumbnail)) {
          images.push(item.thumbnail);
        }
        // Check for photo_image.uri (Facebook Group, Facebook Post)
        else if (item.photo_image?.uri && typeof item.photo_image.uri === 'string' && isImageUrl(item.photo_image.uri)) {
          images.push(item.photo_image.uri);
        }
        // Check for media.image.src (older format)
        else if (item.media?.image?.src && typeof item.media.image.src === 'string' && isImageUrl(item.media.image.src)) {
          images.push(item.media.image.src);
        }
        // Check for image.src
        else if (item.image?.src && typeof item.image.src === 'string' && isImageUrl(item.image.src)) {
          images.push(item.image.src);
        }
        // Check for direct image field
        else if (item.image && typeof item.image === 'string' && isImageUrl(item.image)) {
          images.push(item.image);
        }
        // Check for url field
        else if (item.url && typeof item.url === 'string' && isImageUrl(item.url)) {
          images.push(item.url);
        }
        // Check for src field
        else if (item.src && typeof item.src === 'string' && isImageUrl(item.src)) {
          images.push(item.src);
        }
      });
    } else if (typeof data === 'object') {
      // Handle single attachment object
      if (data.thumbnail && typeof data.thumbnail === 'string' && isImageUrl(data.thumbnail)) {
        images.push(data.thumbnail);
      } else if (data.photo_image?.uri && typeof data.photo_image.uri === 'string' && isImageUrl(data.photo_image.uri)) {
        images.push(data.photo_image.uri);
      } else if (data.media?.image?.src && typeof data.media.image.src === 'string' && isImageUrl(data.media.image.src)) {
        images.push(data.media.image.src);
      } else if (data.image?.src && typeof data.image.src === 'string' && isImageUrl(data.image.src)) {
        images.push(data.image.src);
      } else if (data.image && typeof data.image === 'string' && isImageUrl(data.image)) {
        images.push(data.image);
      } else if (data.url && typeof data.url === 'string' && isImageUrl(data.url)) {
        images.push(data.url);
      } else if (data.src && typeof data.src === 'string' && isImageUrl(data.src)) {
        images.push(data.src);
      }
    }
  } catch (error) {
    // If parsing fails, return empty array
    console.warn('Failed to extract images from attachments:', error);
  }

  return images.filter((url) => url && url.length > 0);
}

/**
 * Get image URLs from a data object
 * Checks both direct URL fields and attachment fields
 */
export function getImageUrlsFromData(data: any): { field: string; urls: string[] }[] {
  const result: { field: string; urls: string[] }[] = [];

  if (!data || typeof data !== 'object') return result;

  Object.entries(data).forEach(([key, value]) => {
    // Check if it's a direct image URL
    if (typeof value === 'string' && isImageUrl(value)) {
      result.push({ field: key, urls: [value] });
    }
    // Check if it's an attachments field
    else if (key.toLowerCase().includes('attachment')) {
      const images = extractImagesFromAttachments(value);
      if (images.length > 0) {
        result.push({ field: key, urls: images });
      }
    }
    // Check if field name suggests it's an image field
    else if (isImageField(key) && typeof value === 'string' && value.startsWith('http')) {
      result.push({ field: key, urls: [value] });
    }
  });

  return result;
}

/**
 * Extract image URLs from Facebook user object
 */
export function extractImageFromUser(user: any): string | null {
  if (!user || typeof user !== 'object') return null;

  // Check for profilePic field
  if (user.profilePic && typeof user.profilePic === 'string' && isImageUrl(user.profilePic)) {
    return user.profilePic;
  }

  // Check for other common profile image fields
  if (user.profile_picture && typeof user.profile_picture === 'string' && isImageUrl(user.profile_picture)) {
    return user.profile_picture;
  }

  if (user.avatar && typeof user.avatar === 'string' && isImageUrl(user.avatar)) {
    return user.avatar;
  }

  return null;
}

/**
 * Extract image URLs from Facebook media array
 */
export function extractImagesFromMedia(media: any): string[] {
  const images: string[] = [];

  if (!media) return images;

  try {
    const data = Array.isArray(media) ? media : [media];

    data.forEach((item) => {
      if (!item || typeof item !== 'object') return;

      // Check for thumbnail field (most common)
      if (item.thumbnail && typeof item.thumbnail === 'string' && isImageUrl(item.thumbnail)) {
        images.push(item.thumbnail);
      }
      // Check for photo_image.uri
      else if (item.photo_image?.uri && typeof item.photo_image.uri === 'string' && isImageUrl(item.photo_image.uri)) {
        images.push(item.photo_image.uri);
      }
      // Check for direct image field
      else if (item.image && typeof item.image === 'string' && isImageUrl(item.image)) {
        images.push(item.image);
      }
      // Check for src field
      else if (item.src && typeof item.src === 'string' && isImageUrl(item.src)) {
        images.push(item.src);
      }
    });
  } catch (error) {
    console.warn('Failed to extract images from media:', error);
  }

  return images.filter((url) => url && url.length > 0);
}

/**
 * Check if a value contains image data (URL, attachments, etc.)
 */
export function hasImageData(value: any, fieldName?: string): boolean {
  // Direct URL check
  if (typeof value === 'string' && isImageUrl(value)) {
    return true;
  }

  // Field name check
  if (fieldName && isImageField(fieldName) && typeof value === 'string' && value.startsWith('http')) {
    return true;
  }

  // Attachments check
  if (fieldName && fieldName.toLowerCase().includes('attachment')) {
    const images = extractImagesFromAttachments(value);
    return images.length > 0;
  }

  // User object check
  if (fieldName && fieldName.toLowerCase() === 'user') {
    return extractImageFromUser(value) !== null;
  }

  // Media array check
  if (fieldName && fieldName.toLowerCase() === 'media') {
    return extractImagesFromMedia(value).length > 0;
  }

  return false;
}
