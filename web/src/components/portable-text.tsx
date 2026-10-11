import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

/** Renders product descriptions; styling comes from the .prose-product class. */
export function RichText({ value }: { value: { _type: string; _key: string }[] | null | undefined }) {
  if (!value?.length) return null;
  // TypeGen marks span children optional; Portable Text tolerates that at runtime.
  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
