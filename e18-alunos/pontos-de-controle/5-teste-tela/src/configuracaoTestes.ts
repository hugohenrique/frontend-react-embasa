import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Os conferidores de tela, como toBeInTheDocument
// E depois de cada teste, a tela desenhada é desmontada, para o próximo começar do zero
afterEach(() => {
  cleanup();
});
