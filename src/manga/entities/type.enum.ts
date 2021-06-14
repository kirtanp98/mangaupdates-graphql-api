import { registerEnumType } from '@nestjs/graphql';

export enum MangaType {
  Artbook = 'Artbook',
  Doujinshi = 'Doujinshi',
  DramaCD = 'Drama CD',
  Filipino = 'Filipino',
  Indonesian = 'Indonesian',
  Manga = 'Manga',
  Manhwa = 'Manhwa',
  Manhua = 'Manhua',
  Novel = 'Novel',
  OEL = 'OEL',
  Thai = 'Thai',
  Vietnamese = 'Vietnamese',
  Malaysian = 'Malaysian',
  Nordic = 'Nordic',
  French = 'French',
  Spanish = 'Spanish',
}

export enum MangaGenre {
  Action = 'Action',
  Adult = 'Adult',
  Adventure = 'Adventure',
  Comedy = 'Comedy',
  Doujinshi = 'Doujinshi',
  Drama = 'Drama',
  Ecchi = 'Ecchi',
  Fantasy = 'Fantasy',
  GenderBender = 'Gender Bender',
  Harem = 'Harem',
  Hentai = 'Hentai',
  Historical = 'Historical',
  Horror = 'Horror',
  Josei = 'Josei',
  Lolicon = 'Lolicon',
  MartialArts = 'Martial Arts',
  Mature = 'Mature',
  Mecha = 'Mecha',
  Mystery = 'Mystery',
  Psychological = 'Psychological',
  Romance = 'Romance',
  SchoolLife = 'School Life',
  Scifi = 'Sci-fi',
  Seinen = 'Seinen',
  Shotacon = 'Shotacon',
  Shoujo = 'Shoujo',
  ShoujoAi = 'Shoujo Ai',
  Shounen = 'Shounen',
  ShounenAi = 'Shounen Ai',
  SliceofLife = 'Slice of Life',
  Smut = 'Smut',
  Sports = 'Sports',
  Supernatural = 'Supernatural',
  Tragedy = 'Tragedy',
  Yaoi = 'Yaoi',
  Yuri = 'Yuri',
}

export enum MangaStatus {
  Ongoing = 'Ongoing',
  Hiatus = 'Hiatus',
  Complete = 'Complete',
}

export enum Period {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  ThreeMonths = '3 Month',
  SixMonths = '6 Month',
  Year = 'Year',
}

registerEnumType(MangaType, {
  name: 'Manga Type',
  description: 'Type of the manga',
});

registerEnumType(MangaGenre, {
  name: 'Manga Genre',
  description: 'Genre of the manga',
});

registerEnumType(MangaStatus, {
  name: 'Manga Status',
  description: 'Status of the manga',
});

registerEnumType(Period, {
  name: 'Activity Stats',
  description: 'Activity Stats of the manga',
});