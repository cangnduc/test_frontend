## Next.js Pattern: Push Client Components to the Leaf

**Description**

Default everything to Server Components. Only introduce Client Components at the smallest possible boundary (the leaf) where interactivity is required.

Short version:

- “Push client logic to the leaves; keep the tree server-first.”

**Why**

- Server Components: no JS sent to browser, faster, can access backend directly
- Client Components: only needed for interactivity (state, events, effects)
- Goal: minimize client JS and isolate interactivity

---

## Example

### ❌ Bad (Client Component too high)

```tsx
// app/products/page.tsx
"use client";

import { useState } from "react";

export default function ProductsPage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Products</h1>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
// app/products/page.tsx (Server Component)
import AddToCartButton from "./AddToCartButton";

export default async function ProductsPage() {
  const products = await fetch("https://api.example.com/products").then((r) =>
    r.json(),
  );

  return (
    <div>
      <h1>Products</h1>
      {products.map((p: any) => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <AddToCartButton productId={p.id} />
        </div>
      ))}
    </div>
  );
}
// app/products/AddToCartButton.tsx (Client Component)
("use client");

import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added" : "Add to cart"}
    </button>
  );
}
```
