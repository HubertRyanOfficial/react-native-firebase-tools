<p align="center">
  <a href="https://x.com/hubertryanoff">
    <img width="100%" src="https://imgur.com/oi5NvjM.png"><br/>
  </a>
  <h2 align="center">React Native Firebase Tools</h2>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-firebase-tools"><img src="https://img.shields.io/npm/dm/react-native-firebase-tools.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://www.npmjs.com/package/react-native-firebase-tools"><img src="https://img.shields.io/npm/v/react-native-firebase-tools.svg?style=flat-square" alt="NPM version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/npm/l/react-native-firebase-tools.svg?style=flat-square" alt="License"></a>
</p>

**React Native Firebase Tools** is a library for React Native designed to simplify interactions with Firebase on react native with [RNFirebase](https://github.com/invertase/react-native-firebase). Inspired by the powerful structure of [React Query](https://github.com/tanstack/query), it provides intuitive tools for managing states like loading, snapshots, and auto requests, enabling cleaner and more efficient code when working with documents, collections, and other Firebase resources _(soon data persistency improvements...)_.

This library offers developers useful features such as automatic handling of loading, data, and error states, delivering a smoother and more concise development experience.

## Features

- 🍿 **Data Formatter**
  - Okay. It was a big problem with default firestore response. We needed to destructure all data to prepare to our way and how our front-end needed, for example if a post was liked we need to send a new property to the components call like along with the data returned, different how it was received our document. Now you can create a fomatter function and treat as you want.
  - With formatter you have more control how the data will be accept and treated on our components or routes.
- 🕐 **Loading management**
  - Now you no longer need to create multiple loadings to wait for the request, with rn-firebase-tools you already have a loading state among other properties after making the request in a document.
- 🚀 **Auto Request**
  - With one of the most important options of rn-firebase-tools, you can now just set a property called autoRequest and the useEffect will go away. With autoRequest when the page loads the request will already be made.
  - Avoids verbose code for every call you make to firestore to load the initial data.
- 🛠️ **Response Improvements**
  - With this, you already receive the ID of each document along with the data, without having to destructure and call the firestore .data function. This is an inevitable pattern for rn-firebase-tools.
  - Avoids every new response a new destructuring.
- 💫 **Real-time Snapshot**
  - You don't need more get worried about unsubscribe functions when use onSnapshot function to receive real-time data, Now the react native firebase tools take care of this for you.
  - You can also set as autoRequest and It'll start streaming data for you and you decide when it mus be in real-time or not using a external state.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

## Supported modules

Now with **React Native Firebase Tools**, we can use the **firestore module** to specific documents and collections. 🤹

### Firestore

- **useGetDoc:** Get specific documents in a collection or subcollection.
- **useGetDocs:** Get documents between collections and it may be possible to get all documents, pagination included and much more

### Storage

- **useUpload:** Upload files with data such as upload progress value ​​already included, automatic download URL generation and more. **(✳️ SOON)**

## Installation

```sh
npm install react-native-firebase-tools

# Using expo:
npx expo install react-native-firebase-tools

```

If you're using react native firebase tools, you need to install react-native-firebase firsly to use that. Make sure you followed the [installation steps here](https://github.com/invertase/react-native-firebase) for the packages your application needs.

If you're using Expo and want to use RNFirebase and RNFirebaseTools you need to follow [additional steps](https://rnfirebase.io/#expo).

## Usage

With the library to use Firebase with React Native, we would need to create a function where we use the **.get** function after passing the reference of the document or a specific collection.

That said, in addition to creating a new function, we would have to:

1. Create a loading state
2. Handle the error individually and use several destructurings to be able to obtain the ID together with the data that comes from the database
3. Or if we wanted to change it to adapt our front end with some initial values.

_So that is so bad and we can improve it._ 😪

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

With **react native firebase tools** IT'S EASY. 🤭

Now to create a new request in a given document, explore your experience to the fullest just by doing this:

```ts

...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function App() {

  const { data, loading, error } = useGetDoc(postRef, {
    autoRequest: true
  });

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && (
        <View>
          <Text>{data.photoURL}</Text>
          <Text>{data.username}</Text>
        </View>
      )}
    </View>
  );

}
...

```

Now you already have a loading state, data when exists and ready and error if it exists. So yeah, you're good right? **FIREBASE** IS INSANE.

The **autoRequest** property is a property used to run the request when the page or component is mounted. Buf if you don't need that, you can just use the function request to request in the reference passed and just wait 💫

Like that:

```ts

...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';


// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function App() {

  const { data, loading, request } = useGetDoc(postRef);

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && (
        <View>
          <Text>{data.photoURL}</Text>
          <Text>{data.username}</Text>
        </View>
      )}
      <Button onPress={request} />
    </View>
  );

}
...

```

As you see, we just need to call the request and the same thing will happen using a button to request whenever the user click.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

Remember that with React Native Firebase Tool, you'll already have the ID within data response, then you don't need to destructure to do that. That's means that is **ID** + **Data** reponse.

With that you don't need to call **.data()**, the data is come as a simple object.

```ts
...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';


// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function App() {

  const { data, loading, request } = useGetDoc(postRef);

  const postId = data.id;

  ...
}

...


```

### Real time snapshots

In Firestore, there is a way to keep our data in real time as soon as it is updated. If you have a minimum experience with Firebase, you would need to specify, in addition to the onSnapshot event, the _onComplete_, _onError_ and _onNext_ events.

You would also have to handle when the unsubscribe should be triggered to turn off the listener and stop listening to the changes. However now we have **React Native Firebase Tools** 🥶.

You can make it real time like that:

```ts

...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';


// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function PostComponent() {

  const { data, loading } = useGetDoc(postRef, {
    autoRequest: true,
    snapshot: true
  });

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          {data.usersCommentStatus.join(', ')} are typing...
        </View>
      )}
    </View>
  );

}
...

```

And.......... then....... 🚀

The React Native Firebase Tools will take care of **unsubscribe** when the page or component is unmounted and you don't need get worried about, just receive your data in real-time. It's very good for a chat for example.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

What if we don't want a **autoRequest** when the page is mounted create a real-time streaming, but I want to request it whenever I want. OKAY! Hubert Ryan is here, don't worry 😌

You can call instead of request method, call **requestSnapshot** like that:

```ts

...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';


// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function PostComponent() {

  const { data, loading, requestSnapshot } = useGetDoc(postRef, {
    snapshot: true
  });

  const handleJoinToChat = useCallback(() => {
    ...
    requestSnapshot()
    // Here it'll start to listening and return the changes, it's not a promise.
    ...
  }, [requestSnapshot])

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && (
        <View>
          {data.usersCommentStatus.join(', ')} are typing...
        </View>
      )}
      <Button onPress={handleJoinToChat} />
    </View>
  );

}
...

```

## Collections

New version **0.1.3** or **higher**, now it is possible to get documents from collections using Firesotre with many cool properties that facilitate our implementation with **pagination**, **snapshot** and **list grouping**. 💡

To be able to query collections you need to first import **useGetDocs** instead of **useGetDoc**.

> useGetDoc is for specific document and useGetDocs is for collections

You can get the list of comments this way:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

const postRef = firestore().collection('posts');

export default function App() {
  const { data, loading } = useGetDocs(postRef, {
    autoRequest: true,
  });
```

The same **options** you have in useGetDoc, you will have with useGetDocs, however we have some additional ones within useGetDocs such as pagination.

### Pagination with collections

The goal of React Native Firebase tools is to deliver as many ready-made tools as possible that can facilitate the implementation of features that would take a little longer using Firebase, and one of them is pagination.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

By **pagination** within a collection of documents you can:

1. Use the same resources and assemble your document collection reference using RNFirebase itself, but being able to enable pagination by simply changing a property.
2. Whether or not to group the data that may appear at each page change.

See how simple it is to add pagination to the comments collection with RNFirebaseTools:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

const postRef = firestore().collection('posts').limit(6);

export default function App() {
  const { data, loading, request } = useGetDocs(postRef, {
    autoRequest: true,
    pagination: true
  });


```

Is it not simple? You don't need to handle startAfter or startAt. It's just _GO_! 🤹

Now a simple way to be able to advance to each page is to call the same **request** function for the next page, RNFirebaseTools already stores the previous value to be able to page between documents.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

**You know what's good?** It also returns when the list is at the **_end_** of the pagination with an end property ✅.

Like that way:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

const postRef = firestore().collection('posts').limit(6);

export default function App() {
  const { data, loading, end, request } = useGetDocs(postRef, {
    autoRequest: true,
    pagination: true
  });

  return (
    <View style={styles.container}>
      {loading && <Text>Loading</Text>}
      {!loading && data.map(post => (
        <View key={post.id}>
          <Text>{post.username}</Text>
          <Image src={{post.photoURL}}>
        </View>
      ))
      <Button
        disabled={end}
        title={!end ? 'Next' : 'Ops, the list is over'}
        onPress={request}
      />
    </View>
  );
}
```

> Important to mention: pagination is based on the **limit** function that is used in its reference as the _postRef_ above to be able to identify that it has reached the end.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

Você poderá obviamente criar suas referencias da forma que desejar e do mesmo jeito que o firebase suporta, isso não te limita, como por exemplo utilizar orderBy com a referencia:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

// A reference with orderBy and limit functions to get desc based on creation date
const postRef = firestore()
  .collection('posts')
  .orderBy('createdAt', 'desc')
  .limit(6);

export default function App() {
  const { data, loading, end, request } = useGetDocs(postRef, {
    autoRequest: true,
    pagination: true
  });

  ...
}
```

### Pagination and document grouping

One way to improve our pagination is to be able to **group** all the data on each page that is passed or not. This is good for applications that need to have a feed so that they can use the scroll and have the posts above return. By default, _grouping_ is disabled and is based on the limit function if it exists.

Simply by deactivating group documentation, it will replace what was there before and show the new ones, like this:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

// A reference with orderBy and limit functions to get desc based on creation date
const postRef = firestore()
  .collection('posts')
  .orderBy('createdAt', 'desc')
  .limit(6);

export default function App() {
  const { data, loading, end, request } = useGetDocs(postRef, {
    autoRequest: true,
    pagination: {
      documentGrouping: false
    }
  });

  ...
}
```

The above example is very useful when we create a table with a different pagination model by number. 🧩

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

If you are creating a **feed** or somewhere you want to actually create a list on each page passed you can leave this option as true like the example below:

```ts
...
import firestore from '@react-native-firebase/firestore';

import { useGetDocs } from 'react-native-firebase-tools';

// A reference with orderBy and limit functions to get desc based on creation date
const postRef = firestore()
  .collection('posts')
  .orderBy('createdAt', 'desc')
  .limit(6);

export default function App() {
  const { data, loading, end, request } = useGetDocs(postRef, {
    autoRequest: true,
    pagination: {
      documentGrouping: true
    }
  });

  ...
}
```

## Formatters

As you know, when data is returned in Firebase, we can get the data with the **.data()** function. There may be several situations where we need to format the data by adding more data to feed our layout, or change behaviors, for example:

1. With an initial state of the like reaction in the post based on the data that comes from the documents.
2. Or even format strings before being displayed.
3. Check data in a global management and return it based on that information.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

There are several examples where formatters can be used. Let's take a simple example with the like reaction example itself.

With this basic example we can say that the data that comes from the document post does not tell us whether it was liked or not. This means that we need to get it from somewhere in order to verify this information. Obviously this is a fictitious case, but most of the time another call is also made in the backend to this. 🫡

So we can like that, get this example:

```ts

...

import { useStore } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';


// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function PostComponent() {

  // Assuming we have all the post ids inside a reducer with Redux.
  const likedPosts = useStore(store => store.userReducer.likedPosts || []);

  const { data } = useGetDoc(postRef, {
    autoRequest: true,
    formatterFn: (data) => {

      const isLiked = likedPosts.find(post => post.id === data.id);

      return {
        ...data,
        isLiked: isLiked ? true : false
      }
    }
  });

  const [isLiked, setIsLiked] = useState(data.isLiked);

  return (
    <View style={styles.container}>
      {data && (
        <View>
          <View>
            <Text>{data.photoURL}</Text>
            <Text>@{data.username}</Text>
          <View>
          <View>
            <LikeIcon isLiked={disLiked} onPresse={() => setIsLiked(!isLiked)}/>
          {data.usersCommentStatus.join(', ')} are typing...
        </View>
      )}
      <Button onPress={handleJoinToChat} />
    </View>
  );

}
...

```

As you can see, there are endless possibilities with the **formatter** function. With it, we can also avoid all the verbose code when creating functions and functions to simply adapt to our front-end using the mobile-first strategy.

With the **Formatter**, you can easily enter a very positive experience with mobile first and initial states. 🙌

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

If you need a **complex** formatter function, I recommend create a separated file and we'll have a good organization in the project. Below I show where the files are and how import that, Of course, we can also reuse it in other requests:

```ts
// * src/components/Post
...

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from '../services/posts/schema';

// Document reference to the posts - post: collection - doc: 00HjLZBHOA7QgfmtbyTe
const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

function PostComponent() {

  const { data } = useGetDoc(postRef, {
    autoRequest: true,
    formatterFn
  });

  const [isLiked, setIsLiked] = useState(data.isLiked);

  return (
    <View style={styles.container}>
      {data && (
        <View>
          <View>
            <Text>{data.photoURL}</Text>
            <Text>@{data.username}</Text>
          <View>
          <View>
            <LikeIcon isLiked={disLiked} onPresse={() => setIsLiked(!isLiked)}/>
          {data.usersCommentStatus.join(', ')} are typing...
        </View>
      )}
      <Button onPress={handleJoinToChat} />
    </View>
  );

}
...

```

```ts
// * src/services/posts/schema

import store from '../../store';

export function formatterFn(data) {
  const likedPosts = store.getState().userReducer.likedPosts || [];

  return {
    ...data,
    isLiked: isLiked ? true : false,
    edit: false,
    images: {
      ...data.images,
      error: false,
      loading: true,
    },
  };
}
```

### Formatting collections

In the same way that we can format specific documents, we can format using **useGetDocs** to be able to specify how we want to treat the documents in our collection front, however instead of RNFirebaseTools returning us a document, it returns us an array of them, see below:

```ts

...

import { useStore } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { useGetDocs } from 'react-native-firebase-tools';


// Document reference to the posts
const postRef = firestore().collection('posts')

function PostList() {

  // Assuming we have all the post ids inside a reducer with Redux.
  const likedPosts = useStore(store => store.userReducer.likedPosts || []);

  const { data, loading } = useGetDocs(postRef, {
    autoRequest: true,
    formatterFn: (data) => {

      const posts = data.map(post => {
        const isLiked = likedPosts.find(post => post.id === data.id);

        return {
          ...post,
          isLiked: isLiked ? true : false
        }
      })

      return posts;
    }
  });

  return (
    <View style={styles.container}>
      {loading && <Text>Loading</Text>}
      {!loading && data.map(post => (
        <View key={post.id}>
          <Text>{post.username}</Text>
          <Image src={{post.photoURL}}>
          <HearIcon color={post.isLiked ? 'red' : 'light-gray'}>
        </View>
      ))
    </View>
  );
}
...

```

As I said above it is always good to move our formatters to another file using the folder structure: `services/{entity}/schema.ts` _(Just a tip)_.

## Typescript

Do you think I didn't think about our types 😸? With **TypeScript** it works very simply with react-native-firebase-tools being able to type all data returns.

Let's first type the return form that comes directly from the documents within the firestore for example.

So you can do like that:

```ts

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

interface PostType {
  audioId?: string;
  audioURL: string;
  createdAt: number;
  duration: number;
  extension: string;
  tags: string[];
  userId: string;
  username: string;
  profileURL: string;
}

export default function ViewPost({params}) {

  const specificPost = firestore().collection('posts').doc(params.postId);

  const { data, loading } = useGetDoc<PostType>(specificPost, {
    autoRequest: true,
    snapshop: false,
  });

  ...
}

...

```

Now React Native Firebase Tools already know that the data is that format or type. Remembering how I had it above, you don't need to specify the **ID** in the type, because it's already added by default.

### Formatters with types

We can type formatter in two incredible ways with React Native Firebase Tools.
They are:

1. 📦 Creating a type like we created above for the data that comes from the documents, like `PostType`, then we can have how the date is when access from Formatter function.
2. 💡 Create another type so we can take it from the form that the formatter will give us at the end and use the data. This is amazing!

So we can do like that:

```ts

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

interface PostType {
  audioId?: string;
  audioURL: string;
  createdAt: number;
  duration: number;
  extension: string;
  tags: string[];
  userId: string;
  username: string;
  profileURL: string;
}

interface PostFormatterType extends PostType {
  isLiked: boolean;
}

export default function ViewPost({ params }) {

  const specificPost = firestore().collection('posts').doc(params.postId);

  // Assuming we have all the post ids inside a reducer with Redux.
  const likedPosts = useStore(store => store.userReducer.likedPosts || []);

  const { data } = useGetDoc<PostType, PostFormatterType>(postRef, {
    autoRequest: true,
    formatterFn: (rawData) => {

      const isLiked = likedPosts.find(post => post.id === rawData.id);

      return {
        ...rawData,
        isLiked: isLiked ? true : false
      }
    }
  });

  ...
}

...

```

Here we can assume that in the end, the data corresponds to the type `PostFormatterType` and the rawData which would be the form in which the document came from the bank would be its original format which corresponds to the `PostType`.

> Remembering how I had it above, you don't need to specify the document **ID** in the type, because it's already added by default, even if you are using formatter.

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

**Recommendation:** In the same way I talked about separating the formatting files, also separating the types, we can leave it like that and keep it clean...

```ts
import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from '../services/posts/schema';
import type { PostType, PostFormatterType } from '../services/posts/types'

export default function ViewPost({ params }) {

  const specificPost = firestore().collection('posts').doc(params.postId);

  const { data } = useGetDoc<PostType, PostFormatterType>(postRef, {
    autoRequest: true,
    formatterFn
  });

  ...
}
...
```

### Formatters with collection types

There is nothing different than above, however using **useGetDocs** to get documents from a collection, you do not need to determine a typing like an array, like a group of objects.

RNFirebase Tools already knows that it is an array that comes from the **useGetDocs** method, so just repeat the process.😇

**Wrong way ❌**

```ts
...
  import type { PostType, PostFormatterType } from '../services/posts/types'

  const postsRef = firestore().collection('posts').limit(12);

  export default function PostList() {
    const { data } = useGetDocs<PostType[], PostFormatterType[]>(postsRef, {
      pagination: {
        documentGrouping: true,
      }
    });

    ...
  }
  ...
```

**Correct way ✅**

```ts
...
  const postsRef = firestore().collection('posts').limit(12);

  export default function PostList() {
    const { data } = useGetDocs<PostType, PostFormatterType>(postsRef, {
      pagination: {
        documentGrouping: true,
      }
    });
    ...
  }
  ...
```

## Freedom with references

I developed React Native Firebase Tools with the intention of having as much freedom as possible, just like we have with the main module 🕹️. So with that, we can use any doc reference in any way we want and apply it as the first parameter of the **useGetDoc** function.

```ts
const specificPost = firestore().collection('collections').doc('id');
```

OR

```ts
const specificPost = firestore()
  .collection('collection')
  .doc('id')
  .collection('sub-collection')
  .doc('id');
```

OR more sub collections

```ts
const specificPost = firestore()
  .collection('collection')
  .doc('id')
  .collection('sub-collection')
  .doc('id')
  .collection('sub-sub-collection')
  .doc('id');
```

We can create it in the same way as the main module, which is [@react-native-firebase/firestore](https://github.com/invertase/react-native-firebase/tree/main/packages/firestore) together with [@react-native-firebase/app](https://github.com/invertase/react-native-firebase/tree/main/packages/app).

Then you can use assigning to a variable or not:

```ts

// Without assigning doc reference to a variable
import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from '../services/posts/schema';
import type { PostType, PostFormatterType } from '../services/posts/types'

export default function ViewPost({  params}) {

  const { data } = useGetDoc<PostType, PostFormatterType>(firestore().collection('posts').doc(params.postId), {
    autoRequest: true,
    formatterFn
  });

  ...
}
...
```

<img width="100%" src="https://imgur.com/RgqRyiF.png"><br/>

Below, in addition to **assigning** the reference to a variable, we are taking a dynamic value called `postId` that comes from the route parameters.

> I recommend whenever possible leaving the external reference or using useMemo to avoid rendering.

```ts
// Assigning doc reference to a variable

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from '../services/posts/schema';
import type { PostType, PostFormatterType } from '../services/posts/types'

export default function ViewPost({ params }) {

  const specificPostRef = firestore().collection('posts').doc(params.postId);

  const { data } = useGetDoc<PostType, PostFormatterType>(specificPostRef, {
    autoRequest: true,
    formatterFn
  });

  ...
}
...
```

```ts
// With useMemo
import { useMemo } from 'react'

import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from '../services/posts/schema';
import type { PostType, PostFormatterType } from '../services/posts/types'

export default function ViewPost({ params }) {

  const specificPostRef = useMemo(() => firestore().collection('posts').doc(params.postId), [params.postId]);

  const { data } = useGetDoc<PostType, PostFormatterType>(specificPostRef, {
    autoRequest: true,
    formatterFn
  });

  ...
}
...
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
