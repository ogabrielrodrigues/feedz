type Unit = {
  city: string
  country: string
}

export const units: Unit[] = [
  { city: "Alegrete/RS", country: "BR" },
  { city: "Aparecida de Goiânia/GO", country: "BR" },
  { city: "Araguaína/TO", country: "BR" },
  { city: "Araraquara/SP", country: "BR" },
  { city: "Bagé/RS", country: "BR" },
  { city: "Barretos/SP", country: "BR" },
]

type Sector = {
  sector: string
  mapper: string
}

export const sectors = [
  "Administrativo",
  "Gerência",
  "Jurídico",
  "Produção",
  "T.I",
]

export const filterSectors = [
  "Todos",
  "Administrativo",
  "Gerência",
  "Jurídico",
  "Produção",
  "T.I",
]
