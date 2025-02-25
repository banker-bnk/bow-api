export default function extractProductId(url) {
    // Regex pattern to match the first type of URL (like articulo.mercadolibre.com.ar/MLA-1234567890-...)
    const regexProductId = /\/(MLA-\d+)/;
    
    // Regex pattern to match the second type of URL (with item_id=MLA1234567890)
    const regexItemId = /item_id:([A-Z0-9]+)/;
  
    // Try to match the first pattern (for articulo.mercadolibre.com.ar/MLA-1234567890-...)
    const productIdMatch = url.match(regexProductId);

    console.log("1st " + productIdMatch);

    if (productIdMatch) {
      return productIdMatch[1].replace(/-/g, ''); // Return the product ID without dashes
    }
  
    // If the first pattern doesn't match, try the second pattern (item_id=MLA1234567890)
    const itemIdMatch = url.match(regexItemId);

    console.log("2nd " + itemIdMatch);

    if (itemIdMatch) {
      return itemIdMatch[1]; // Return the product ID from the item_id query parameter
    }
  
    // If no product ID is found, return null
    return null;
  }
  