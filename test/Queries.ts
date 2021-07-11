export class Queries {
  static series = `
    {
      series(id: 33) {
        id
        title
        description
        type
        related {
          id
          name
          type
        }
        associatedName
        groups {
          id
          name
        }
        releases
        status
        fullyScanlated
        animeChapters
        userReviews
        forumStats {
          topics
          posts
        }
        cached
        englishPublishers
        licensed
        serializedMagazines
        originalPublishers
        year
        artist
        authors
        categories {
          score
          name
        }
        image
        genres
        lastUpdated
        ratings {
          votes
          average
          bayesianAverage
          distribution
        }
        categoriesRecommendations {
          id
          name
          type
        }
        recommendations {
          id
          name
          type
        }
        activityStats {
          dateRange
          position
          change
        }
        listStats {
          list
          amount
        }
      }
    }
  `;
}
