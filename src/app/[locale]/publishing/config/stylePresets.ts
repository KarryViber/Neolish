export interface StylePreset {
  id: string;
  name: string;
  imageUrl: string;
  description: string; // This will hold the Dify prompt
}

export const predefinedStyles: StylePreset[] = [
  { 
    id: 'style-custom', 
    name: 'Custom', 
    imageUrl: '', 
    description: '' 
  },
  {
    id: 'blue-geometric',
    name: 'Blue Geometric',
    imageUrl: '/covers/001.png',
    description: `Create a modern Japanese corporate seminar poster with a dynamic geometric design featuring a blue and white color scheme with yellow accents, characterized by diagonal layouts, asymmetrical text placement, scattered triangular shapes, professional headshot integration, clean typography hierarchy, gradient backgrounds, and angular design elements that convey corporate professionalism and contemporary business training aesthetics.`
  },
  { 
    id: 'clean-typography', 
    name: 'Clean Typography', 
    imageUrl: '/covers/002.png', 
    description: 'Clean minimalist tech announcement design with purple gradient border, simple black and white line art illustration, modern sans-serif typography, and plenty of white space creating a friendly corporate communication style.' // Placeholder - Update with actual prompt
  },
  { 
    id: 'tutorial-style', 
    name: 'Tutorial Style', 
    imageUrl: '/covers/003.png', 
    description: 'Bright educational tutorial design with cheerful blue background, playful yellow banner elements, cute chibi character illustration, modern laptop graphics, bold typography with white text blocks, and friendly learning-focused layout typical of Japanese online course materials.' // Placeholder - Update with actual prompt
  },
  { 
    id: 'ultra-minimal', 
    name: 'Ultra minimal', 
    imageUrl: '/covers/004.png', 
    description: 'Ultra-minimalist presentation slide design with solid turquoise background, clean white sans-serif typography, centered text layout, and maximum simplicity focusing purely on content delivery without any decorative elements or graphics.' // Placeholder - Update with actual prompt
  },
  { 
    id: 'professional-corporate', 
    name: 'Professional corporate', 
    imageUrl: '/covers/005.png', 
    description: 'Professional corporate marketing banner with soft coral-pink gradient overlay, featuring a young Asian businesswoman in glasses working on laptop in bright modern office setting, clean white Japanese typography on left side, subtle "MARKETING" watermark text, and minimalist company logo, creating a warm yet professional atmosphere for business services presentation.' // Placeholder - Update with actual prompt
  },
  // Add more styles here as needed
]; 