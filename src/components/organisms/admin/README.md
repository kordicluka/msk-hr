# UniversalTable Component

Univerzalna tablica komponenta za admin panel koja podržava sve tipove objekata iz baze podataka.

## Značajke

- **Pretraživanje**: Pretražuje kroz specificirane ključeve
- **Sortiranje**: Sortira po specificirane kolone
- **Empty State**: Prikazuje prazan state kada nema podataka
- **Loading State**: Podržava loading indikator
- **Custom Render**: Mogućnost custom renderiranja za svaku kolonu
- **Klik na red**: Opcija za rukovanje klikom na red
- **Responsive**: Responzivni dizajn

## Korištenje

### Osnovni primjer

```tsx
import {
  UniversalTable,
  TableColumn,
} from "@/components/organisms/admin/UniversalTable";

interface MyDataType {
  id: string;
  name: string;
  createdAt: Date;
}

const columns: TableColumn<MyDataType>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value) => new Date(value as Date).toLocaleDateString("hr-HR"),
  },
];

<UniversalTable
  title="My Data"
  data={myData}
  columns={columns}
  searchableKeys={["name"]}
  sortableColumns={["createdAt"]}
  onCreateClick={() => console.log("Create new")}
/>;
```

### Props

| Prop                    | Tip                 | Obavezno | Opis                        |
| ----------------------- | ------------------- | -------- | --------------------------- |
| `title`                 | `string`            | Da       | Naslov tablice              |
| `data`                  | `T[]`               | Da       | Niz objekata za prikaz      |
| `columns`               | `TableColumn<T>[]`  | Da       | Definicija kolona           |
| `searchableKeys`        | `(keyof T)[]`       | Ne       | Ključevi za pretraživanje   |
| `sortableColumns`       | `string[]`          | Ne       | Nazivi kolona za sortiranje |
| `createButtonText`      | `string`            | Ne       | Tekst create dugmeta        |
| `onCreateClick`         | `() => void`        | Ne       | Funkcija za create dugme    |
| `onRowClick`            | `(item: T) => void` | Ne       | Funkcija za klik na red     |
| `emptyStateText`        | `string`            | Ne       | Tekst za prazan state       |
| `emptyStateDescription` | `string`            | Ne       | Opis za prazan state        |
| `emptyStateIcon`        | `React.ReactNode`   | Ne       | Ikona za prazan state       |
| `loading`               | `boolean`           | Ne       | Loading state               |
| `className`             | `string`            | Ne       | Dodatne CSS klase           |

### TableColumn interface

| Svojstvo    | Tip                                            | Opis                     |
| ----------- | ---------------------------------------------- | ------------------------ |
| `key`       | `keyof T \| string`                            | Ključ objekta ili string |
| `label`     | `string`                                       | Naslov kolone            |
| `sortable`  | `boolean`                                      | Je li kolona sortabilna  |
| `render`    | `(value: unknown, item: T) => React.ReactNode` | Custom render funkcija   |
| `className` | `string`                                       | CSS klase za kolonu      |

## Primjeri korištenja

### Services tabla

```tsx
const serviceColumns: TableColumn<ServiceWithTranslations>[] = [
  {
    key: "id",
    label: "Service",
    render: (value, item) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.translations?.[0]?.title || "Untitled"}
        </span>
        <span className="text-sm text-gray-500">
          {item.translations?.[0]?.subtitle || "No description"}
        </span>
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value) => new Date(value as Date).toLocaleDateString("hr-HR"),
    className: "text-right",
  },
];
```

### Users tabla

```tsx
const userColumns: TableColumn<UserData>[] = [
  {
    key: "name",
    label: "User",
    render: (value, item) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200">
          <User className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}
      >
        {String(value)}
      </span>
    ),
  },
];
```

## Stilovi

Komponenta koristi Tailwind CSS klase i podržava dark mode. Kontejner ima:

- Bijela pozadina
- Zaobljeni rubovi
- Border
- Padding za sadržaj

## Kompatibilnost

Komponenta koristi:

- `@button.tsx` - za dugmad
- `@input.tsx` - za search polje
- `@table.tsx` - za tablicu
- `@dropdown-menu.tsx` - za sort dropdown
- Lucide React ikone
