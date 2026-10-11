import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {PackageIcon} from '@sanity/icons/Package'
import {TagIcon} from '@sanity/icons/Tag'
import {UsersIcon} from '@sanity/icons/Users'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Konten')
    .items([
      S.documentTypeListItem('product').title('Produk').icon(PackageIcon),
      S.listItem()
        .title('Produk per kategori')
        .icon(TagIcon)
        .child(
          S.documentTypeList('category')
            .title('Pilih kategori')
            .child((categoryId) =>
              S.documentList()
                .title('Produk')
                .schemaType('product')
                .filter('_type == "product" && category._ref == $categoryId')
                .params({categoryId})
                .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
            ),
        ),
      S.documentTypeListItem('category').title('Kategori').icon(TagIcon),
      S.divider(),
      S.listItem()
        .title('Beranda')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Beranda')),
      S.listItem()
        .title('Tentang Kami')
        .icon(UsersIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('Tentang Kami')),
      S.divider(),
      S.listItem()
        .title('Pengaturan Situs')
        .icon(CogIcon)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Pengaturan Situs'),
        ),
    ])
