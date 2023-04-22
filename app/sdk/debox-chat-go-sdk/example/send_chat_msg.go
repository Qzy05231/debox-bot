package main

import (
	"flag"
	"fmt"

	dbx_chat "github.com/debox-pro/debox-chat-go-sdk"
)

func main() {
	var cliMsg string
	var cliUserId string
	var cliKey string
	var cliGroupId string
	flag.StringVar(&cliMsg, "m", "", "") // message
	flag.StringVar(&cliUserId, "u", "", "") // userId
	flag.StringVar(&cliGroupId, "g", "", "") // grounpId
	flag.StringVar(&cliKey, "k", "", "") // apiKey
	flag.Parse()

	xApiKey := cliKey
	client := dbx_chat.CreateNormalInterface("https://open.debox.pro", xApiKey)

	toUserId := cliUserId // 蜂鸟id 
	groupId :=  cliGroupId //"118544" // "101280" // 101280 新手群id
	message := cliMsg
	_, err := client.SendChatMsg(toUserId, groupId, message , "send_msg")

	if err != nil {
		fmt.Println("send chat message fail:", err)
		return
	}

	fmt.Println("send chat message success.")

}
