import React, {useState} from 'react'
import {FlatList} from 'react-native'
import {ListItem} from '../components/ListItem'
import {Screen} from '../components/Screen'
import {ListItemSeparator} from '../components/ListItemSeparator'
import {ListItemDeleteAction} from '../components/ListItemDeleteAction'

export declare interface IMessageScreenProps {

}

const initialMessages = [
    {
        id: 1,
        title: 'T1',
        description: 'D1',
        image: {uri: 'https://picsum.photos/512'}
    },
    {
        id: 2,
        title: 'T2',
        description: 'D2',
        image: {uri: 'https://picsum.photos/512'}
    },
    {
        id: 3,
        title: 'T3',
        description: 'D3',
        image: {uri: 'https://picsum.photos/512'}
    },
]

export function MessageScreen() {
    const [messages, setMessages] = useState(initialMessages)
    const [refreshing, setRefreshing] = useState(false)

    const handleDelete = (message: any) => {
        // TODO call the server
        setMessages(messages.filter(m => m.id !== message.id))
    }

    return (
        <Screen>
            <FlatList
                data={messages}
                keyExtractor={message => message.id.toString()}
                renderItem={({item}) => <ListItem
                    title={item.title}
                    subTitle={item.description}
                    image={item.image}
                    rightSwipe={() => (
                        <ListItemDeleteAction onPress={() => handleDelete(item)} />
                    )}
                />
                }
                ItemSeparatorComponent={ListItemSeparator}
                refreshing={refreshing}
                onRefresh={() => {setMessages([{
                    id: 2,
                    title: 'T2',
                    description: 'D2',
                    image: {uri: 'https://picsum.photos/512'}
                },])}}
            />
        </Screen>
    )
}
