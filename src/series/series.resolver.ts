import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { Series } from './entities/series.entity';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private readonly seriesService: SeriesService) {}

  @Query(() => Series, { name: 'series' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.seriesService.getSeries(id);
  }
}
