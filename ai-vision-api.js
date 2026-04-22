// Google Cloud Vision API Client - Fixed Version
// API Key: AIzaSyDgU7MVuUKIrHMZILgW-5EjdMbYImZjjzk (enable Cloud Vision API + billing)

const VISION_API_KEY = 'AIzaSyDgU7MVuUKIrHMZILgW-5EjdMbYImZjjzk';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

// Complete e-waste & material map
const eWasteMap = {
  // Phones & Electronics - Exact labels
  'cell phone': { type: 'e-waste', name: 'Mobile Phone', instructions: 'E-waste center only. Hazardous materials.' },
  'smartphone': { type: 'e-waste', name: 'Smartphone', instructions: 'Electronics recycling required.' },
  'iphone': { type: 'e-waste', name: 'iPhone', instructions: 'Apple store or e-waste facility.' },
  'phone': { type: 'e-waste', name: 'Phone', instructions: 'Electronics collection point.' },
  
  // Computers
  'laptop': { type: 'e-waste', name: 'Laptop', instructions: 'E-waste facility. Remove battery.' },
  'computer': { type: 'e-waste', name: 'Computer', instructions: 'Computer recycling program.' },
  
  // Batteries
  'battery': { type: 'hazardous', name: 'Battery', instructions: 'Battery recycling bin. Tape terminals.' },
  'batteries': { type: 'hazardous', name: 'Batteries', instructions: 'Special battery disposal.' },
  
  // Cables/Chargers
  'charger': { type: 'e-waste', name: 'Charger', instructions: 'E-waste collection.' },
  'usb cable': { type: 'e-waste', name: 'USB Cable', instructions: 'Electronics recycling.' },
  'cable': { type: 'e-waste', name: 'Cable', instructions: 'Bundle & e-waste bin.' },
  
  // Audio/Peripherals
  'headphones': { type: 'e-waste', name: 'Headphones', instructions: 'Electronics recycling.' },
  'keyboard': { type: 'e-waste', name: 'Keyboard', instructions: 'Computer peripherals e-waste.' },
  'mouse computer': { type: 'e-waste', name: 'Mouse', instructions: 'E-waste collection.' },
  
  // Materials - Generic
  'plastic': { type: 'plastic', name: 'Plastic', instructions: 'Rinse. Plastic recycling bin.' },
  'paper': { type: 'paper', name: 'Paper/Cardboard', instructions: 'Flatten. Paper recycling.' },
  'glass': { type: 'glass', name: 'Glass', instructions: 'Rinse. Glass recycling.' },
  'metal': { type: 'metal', name: 'Metal/Aluminum', instructions: 'Rinse. Metal recycling.' },
  
  // Default
  default: { type: 'recyclable', name: 'Mixed Recyclable', instructions: 'Check local recycling rules for material type.' }
};

// Fixed Vision API call - proper Promise chaining
async function analyzeImageWithVision(file) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        // Resize to Vision limits
        const maxSize = 1024;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        const request = {
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 15 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
            ]
          }]
        };
        
        try {
          const response = await fetch(VISION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Vision API error details:', errorText);
            return resolve(null); // Graceful fail
          }
          
          const result = await response.json();
          console.log('Vision API success:', result);
          resolve(result);
        } catch (netError) {
          console.error('Network error:', netError);
          resolve(null);
        }
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
      
    } catch (err) {
      reject(err);
    }
  });
}

async function detectEWaste(imageFile) {
  console.log('Scanning image:', imageFile.name);
  
  const visionResult = await analyzeImageWithVision(imageFile);
  
  if (!visionResult?.responses?.[0]) {
    console.log('No Vision response');
    return eWasteMap.default;
  }
  
  const response = visionResult.responses[0];
  const labels = (response.labelAnnotations || []).map(l => l.description.toLowerCase());
  const objects = (response.localizedObjectAnnotations || []).map(o => o.name.toLowerCase());
  
  console.log('🔍 Labels:', labels.slice(0,10));
  console.log('🎯 Objects:', objects.slice(0,10));
  
  // Match exact labels first
  for (const label of [...labels, ...objects]) {
    if (eWasteMap[label]) {
      console.log(`✅ MATCHED "${label}" → ${eWasteMap[label].name}`);
      return eWasteMap[label];
    }
  }
  
  // Fuzzy match common variations
  const fuzzy = {
    mobile: 'phone',
    smartphone: 'smartphone', 
    telephone: 'phone',
    laptop: 'laptop',
    notebook: 'laptop',
    computer: 'computer',
    battery: 'battery',
    powerbank: 'battery',
    charger: 'charger',
    cable: 'cable',
    usb: 'usb cable',
    headphones: 'headphones',
    keyboard: 'keyboard',
    mouse: 'mouse computer',
    plastic: 'plastic',
    paper: 'paper',
    glass: 'glass',
    metal: 'metal'
  };
  
  for (const label of [...labels, ...objects]) {
    for (const [key, matchKey] of Object.entries(fuzzy)) {
      if (label.includes(key)) {
        const match = eWasteMap[matchKey];
        if (match) {
          console.log(`🔍 FUZZY "${label}" → ${match.name}`);
          return match;
        }
      }
    }
  }
  
  console.log('ℹ️ Default match');
  return eWasteMap.default;
}

// Export
window.aiVision = { detectEWaste };

