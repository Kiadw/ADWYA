import type { NextConfig } from "next";

// En production l'application est servie derrière nginx sous un sous-chemin
// (/biomed) du domaine principal, afin de réutiliser le certificat TLS
// existant. `basePath` doit donc être connu au BUILD pour que Next préfixe
// les assets et la navigation. En développement la variable est absente et
// l'application reste servie à la racine.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'standalone',
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
