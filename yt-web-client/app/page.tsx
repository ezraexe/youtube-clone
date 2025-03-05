// "use client";
// import styles from "./page.module.css";
// import { getVideos } from "./firebase/functions";
// import Image from 'next/image';
// import Link from 'next/link';

// export default async function Home() {
//   const videos = await getVideos(); 

//   return (
//       <main className={styles.main}>
//         {
//           videos.map((video) => (
//             <Link 
//               key={video.filename}
//               href={`/watch?v=${video.filename}`}
//             >
//               <Image 
//                 src={'/thumbnail.png'} 
//                 alt='video' 
//                 width={120} 
//                 height={80}
//                 className={styles.thumbnail}
//               />
//             </Link>
//           ))
//         }
//       </main>
//   );
// }
import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from './firebase/functions';
import styles from './page.module.css'


export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}
