import { registerEnumType } from '@nestjs/graphql';

export enum ResultType {
  Releases,
  Series,
  Scanlators,
  Authors,
  Publishers,
}

export enum ItemsPerPage {
  Five = 5,
  Ten = 10,
  Fifteen = 15,
  TwentyFive = 25,
  Thirty = 30,
  Forty = 40,
  Fifty = 50,
  SeventyFive = 75,
  OneHundred = 100,
}

export enum OrderBy {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(ResultType, {
  name: 'ResultType',
  description: 'Results types that would show when doing a basic search',
});

registerEnumType(ItemsPerPage, {
  name: 'Items',
  description: 'Items',
});

registerEnumType(OrderBy, {
  name: 'OrderBy',
  description: 'How to order on certain sorts',
});
