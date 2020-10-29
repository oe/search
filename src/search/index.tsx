import React from 'react'
import { Input, Form } from "antd"
import './style.scss'

const Search = Input.Search
const FormItem = Form.Item

export default function SearchForm() {
  return (
    <div className="search-form">
      <FormItem >
        <Search
          spellCheck={false}
          autoFocus
          placeholder="input something to search"
          enterButton="Search"
        />
      </FormItem>
    </div>
  )
}
