import { GetStaticProps } from 'next';
import List from '@/components/List';
import proveedoresData from '@/app/data/proveedores.json';

// Interfaces (asegúrate de que estas coincidan en todos tus archivos)
interface Proveedor {
  nombre: string;
  telefono: string;
  cuil: string;
}

interface HomePageProps {
  proveedores: Proveedor[];
}

export default function HomePage({ proveedores }: HomePageProps) {
  return (
    <div className="container">
      <h1 className="title">Gestión de Proveedores</h1>
      <List proveedores={proveedores} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  return {
    props: {
      proveedores: proveedoresData,
    },
  };
};