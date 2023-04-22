package main

import (
	"fmt"
	dbx_chat "github.com/debox-pro/debox-chat-go-sdk"
)

func main() {

	registerUrl := "www.xxx.pro/get_message"
	xApiKey := "xxxxxx"

	client := dbx_chat.CreateNormalInterface("https://open.debox.pro", xApiKey)

	_, err := client.RegisterCallbakUrl(registerUrl, "POST", "register")

	if err != nil {
		fmt.Println("register callback url  fail:", err)
		return
	}

	fmt.Println("register callback url success.")

}
