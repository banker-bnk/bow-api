export default function extractProductId(url) {
    const regexProductId = /\/(MLA-\d+)/;
    const regexItemId = /item_id:([A-Z0-9]+)/;
    const regexWidId = /wid=([^&#]+)/;
  
    const productIdMatch = url.match(regexProductId);
    if (productIdMatch) return productIdMatch[1].replace(/-/g, ''); //product id has a dash, remove it
  
    const itemIdMatch = url.match(regexItemId);
    if (itemIdMatch) return itemIdMatch[1];

    const itemWidMatch = url.match(regexWidId);
    if (itemWidMatch) return itemWidMatch[1];
  
    return null;
  }
  