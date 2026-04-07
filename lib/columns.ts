import { cache } from "react";
import type { Locale } from "@/lib/i18n/config";
import { supabase } from "@/lib/supabase";

export interface Column {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  coverImage: string | null;
  authorName: string | null;
  authorRole: string | null;
  createdAt: string;
}

type ColumnRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  cover_image: string | null;
  author_name: string | null;
  author_role: string | null;
  created_at: string;
};

type ColumnTranslation = {
  title?: string;
  subtitle?: string | null;
  content?: string | null;
  authorRole?: string | null;
};

const columnSelect =
  "id, slug, title, subtitle, content, cover_image, author_name, author_role, created_at";

const roColumnTranslations: Record<string, ColumnTranslation> = {
  "the-5-day-rule": {
    title: "Regula de 5 Zile: De ce Viteza Este Cel Mai Bun Instrument de Marketing",
    subtitle:
      "Cum ne-am transformat modelul de livrare pentru a ajuta afacerile mici sa castige mai repede.",
    content:
      "<p>Viteza este mai mult decat o comoditate; este un avantaj competitiv. Cand o afacere mica poate trece mai rapid de la idee la lansare, poate testa mai repede, invata mai repede si castiga momentum inainte ca oportunitatea sa se raceasca.</p>",
    authorRole: "Fondator, EZWebOne",
  },
  "ai-receptionists-uk": {
    title: "Receptionistii AI: Viitorul Afacerilor de Servicii din UK",
    subtitle:
      "Cum schimba AI-ul localizat industria de hair si beauty din Regatul Unit.",
    content:
      "<p>Industria de servicii din UK trece printr-o revolutie tacuta. Receptionistii AI localizati schimba felul in care afacerile raspund la apeluri ratate, gestioneaza programarile si raman disponibile pentru clienti fara sa adauge mai multa presiune pe echipa.</p>",
    authorRole: "Fondator, EZWebOne",
  },
};

function normalizeColumn(row: ColumnRow): Column {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    content: row.content,
    coverImage: row.cover_image,
    authorName: row.author_name,
    authorRole: row.author_role,
    createdAt: row.created_at,
  };
}

function localizeColumn(column: Column, locale: Locale): Column {
  if (locale !== "ro") {
    return column;
  }

  const localized = roColumnTranslations[column.slug];
  if (!localized) {
    return column;
  }

  return {
    ...column,
    title: localized.title ?? column.title,
    subtitle: localized.subtitle ?? column.subtitle,
    content: localized.content ?? column.content,
    authorRole: localized.authorRole ?? column.authorRole,
  };
}

export const getPublishedColumns = cache(async (locale: Locale = "en"): Promise<Column[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("columns")
    .select(columnSelect)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load columns: ${error.message}`);
  }

  return ((data ?? []) as ColumnRow[]).map(normalizeColumn).map((column) => localizeColumn(column, locale));
});

export const getPublishedColumnBySlug = cache(
  async (slug: string, locale: Locale = "en"): Promise<Column | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("columns")
      .select(columnSelect)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load column: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return localizeColumn(normalizeColumn(data as ColumnRow), locale);
  }
);
