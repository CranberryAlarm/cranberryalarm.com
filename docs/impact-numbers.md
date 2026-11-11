# Impact Numbers

How the four Impact Numbers on the site were counted, so they can be recounted once per Season. Last counted 2026-11-11.

| Impact Number on the site | Exact count | Source |
| --- | --- | --- |
| 1.1M+ video views of our builds | 1,126,843 | YouTube, 104 videos, listed in [impact-videos.csv](impact-videos.csv) |
| 87K+ views of our ChiefDelphi build threads | 87,171 | The four build threads below |
| 200+ ChiefDelphi topics by other teams that mention us | 217 topics, 179 authors | ChiefDelphi search, method below |
| 4 Seasons | 4 | 2023 to 2026 |

## Video views

Every Cranberry Alarm video on the Cranberry Alarm and FUN YouTube channels, one row per video in [impact-videos.csv](impact-videos.csv).

- FUN channel: 98 videos, 1,104,317 views. Cranberry Alarm channel: 6 videos, 22,526 views.
- The `attribution` column says how a video was tied to Cranberry Alarm. `title` means the title names Cranberry Alarm (96 videos, 1,006,854 views). `thread` means the title does not name us, but the video is linked from one of our build threads (8 videos, 119,989 views). Drop the `thread` rows for a stricter count: it is still over 1M.

To recount: look up the current view count for each `video_id`, add any new Season's videos, and sum the `views` column.

## ChiefDelphi thread views

| Season | Thread | Views |
| --- | --- | --- |
| 2023 | https://www.chiefdelphi.com/t/ri3d-cranberry-alarm-2023/420850 | 15,438 |
| 2024 | https://www.chiefdelphi.com/t/ri3d-cranberry-alarm-2024-now-with-more-fun/447177 | 23,300 |
| 2025 | https://www.chiefdelphi.com/t/cranberry-alarm-2025-ri3d/477582 | 18,773 |
| 2026 | https://www.chiefdelphi.com/t/cranberry-alarm-2026-ri3d/509306 | 29,660 |

The view count is shown at the top of each thread.

## ChiefDelphi topics that mention us

1. Fetch `https://www.chiefdelphi.com/search.json?q=%22cranberry%20alarm%22%20order%3Alatest&page=N` for N = 1 to 5.
2. Drop posts in the four build threads above.
3. Drop posts by the team's own accounts and by FUN's account.
4. Count the distinct `topic_id` values that are left.

## Credits

The Credits under the Impact Numbers were each checked by reading the linked post or repository. Add a Credit only when a team says in public that they built on Cranberry Alarm's work.
