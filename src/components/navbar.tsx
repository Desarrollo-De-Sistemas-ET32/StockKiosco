// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex gap-6">
        <li>
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            Acerca de
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contacto
          </Link>
        </li>
      </ul>
    </nav>
  );
}
