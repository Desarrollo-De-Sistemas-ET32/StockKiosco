export type Category = string;

export interface CategoryListProps {
  categories: Category[];
  onDelete: (index: number) => void;
}

export interface CategoryFormProps {
  onAdd: (category: Category) => void;
}
