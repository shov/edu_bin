import React, {useState} from 'react'
import {FlatList} from 'react-native'

import {Screen} from '../components/Screen'
import {Card} from '../components/Card'

const initialListing = [
    {
        id: 1,
        title: 'Place X',
        subTitle: 'hidden one',
        image: {uri: 'https://picsum.photos/1024/768'}
    },
    {
        id: 3,
        title: 'Nature',
        subTitle: 'feel free',
        image: {uri: 'https://picsum.photos/1024/768'}
    },
    {
        id: 4,
        title: 'First date',
        subTitle: '🥰',
        image: {uri: 'https://picsum.photos/1024/768'}
    },
]

export function ListingScreen() {
    const [refreshing, setRefreshing] = useState(false)
    const [listing, setListing] = useState(initialListing)
    return (
        <Screen>
            <FlatList
                data={listing}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <Card
                    title={item.title}
                    subTitle={item.subTitle}
                    image={item.image} />
                }
                refreshing={refreshing}
                onRefresh={
                    () => setListing
                    (
                        initialListing
                            .map(i => {
                                i.id = Math.floor(Math.random() * 100)
                                return i
                            })
                    )

                }
            />
        </Screen>
    )
}

