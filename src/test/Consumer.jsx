import React, { Component } from 'react'

import {Consumer} from './Context'

export default class ConsumerComponent extends Component {
    render() {
        return (
            <Consumer>
                {data => <div>孙子组件中接收到值 -- {data}</div>}
            </Consumer>
        )
    }
}
