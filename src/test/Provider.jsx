import React, { Component } from 'react'

import Second from './Second'

import {Provider} from './Context'

export default class ProviderComponent extends Component {
    render() {
        // const obj = '你是个好人呀'
        const obj = ['你的','我的','大家的']

        return (
            <Provider value={obj}>
                <div>
                    父组件<br/>
                    <Second/>
                </div>
            </Provider>
        )
    }
}
