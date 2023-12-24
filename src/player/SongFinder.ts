import ytsr, { Video } from 'ytsr'
import { Song } from './Song'

type listOptions =
  | 'YoutubeVideo'
  | 'YoutubeVideoID'
  | 'YoutubePlayList'
  | 'YoutubePlaylistID'
  | 'SearchResult'

export class SongFinder {
  static regex = {
    YouTubeVideo:
      /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
    YouTubeVideoID:
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    YouTubePlaylist:
      /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
    YouTubePlaylistID: /[&?]list=([^&]+)/,
  }

  static valdiateURL(url: string): listOptions {
    if (url.match(this.regex.YouTubeVideo)) {
      const t = url.match(this.regex.YouTubeVideo)
      return 'YoutubeVideo'
    } else if (url.match(this.regex.YouTubeVideoID)) {
      return 'YoutubeVideoID'
    } else if (url.match(this.regex.YouTubePlaylist)) {
      return 'YoutubePlayList'
    } else if (url.match(this.regex.YouTubePlaylistID)) {
      return 'YoutubePlaylistID'
    } else {
      return 'SearchResult'
    }
  }

  static async search(
    searchQuery: string,
    limit: number = 10,
    link: boolean = false,
  ) {
    const res = await ytsr.getFilters(searchQuery)
    const video = res.get('Type').get('Video')

    const songs = await ytsr(video.url, { limit })
    const best = songs.items[0] as Video
		//actual listof results
    const results = (songs.items as Video[]).map((item: Video, i) => {
      const songs = {
        url: item.url,
        thumbnail: item.url,
        title: item.title,
        duration: item.duration,
        author: item.author?.name,
      }
      return songs
    })

    return {
      url: best.url,
      thumbnail: best.bestThumbnail?.url,
      title: best?.title,
      duration: best?.duration,
      author: best?.author?.name,
    } as Song
  }

  static async getURL(url: string): Promise<Song> {
    const type = this.valdiateURL(url)

    let song: Song
    switch (type) {
      case 'SearchResult': {
        song = await this.search(url)
        return song
      }
      case 'YoutubeVideo': {
        song = await this.search(url, 1, true)
        return song
      }
      case 'YoutubeVideoID': {
      }
    }
  }
}
