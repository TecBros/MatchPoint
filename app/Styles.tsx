//Imports
import { StyleSheet, Dimensions } from 'react-native';

const colors = {
  DarkGreen: '#caff19', 
  LightGreen: '#faffe7',
  Yellow: '#ffea2f', 
  DarkBlue: '#000a45', 
  LightBlue: '#5385a6', 
  Black: '#21130d',
  White: '#F7F7F7',
};
const { width, height } = Dimensions.get('window');


export default StyleSheet.create({
  // Home screen container styles
  Homecontainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.LightGreen, 
  },
  stadiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },

  // Authentication screen container and title styles
  Authcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.LightGreen,
  },
  Authtitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: width * 0.05,
    color: colors.Black,
    marginHorizontal: width * 0.1, 
    },

  // Authentication input and button styles
  Authinput: {
    fontSize: width * 0.035,
    marginHorizontal: width * 0.1, 
    marginVertical: width * 0.025,
    height: height * 0.07,
    backgroundColor: colors.White, 
    paddingLeft: width * 0.025, 
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0025,
    shadowColor: colors.Black,
    shadowOffset: { width: width * 0, height: width * 0.01 },
    shadowOpacity: width * 0.00025,
    shadowRadius: width * 0.0384,
  },
  Authbutton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: width * 0.05, 
    marginHorizontal: width * 0.1, 
  },

  // Modal overlay and content styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.LightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: colors.White,
    padding: width * 0.07,
    width: width * 0.8,
    maxHeight: width * 0.8,
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0025,
    shadowColor: colors.Black,
    shadowOffset: { width: width * 0, height: width * 0.01 },
    shadowOpacity: width * 0.00025,
    shadowRadius: width * 0.0384,
  },

  // Picker styles
  pickerStyle: {
    width: '100%',
  },

  pickerTrigger: {
    padding: width * 0.04,
    backgroundColor: colors.White,
    marginHorizontal: width * 0.1, 
    marginVertical: width * 0.025,
    height: height * 0.07,
    paddingLeft: width * 0.025, 
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0025,
    shadowColor: colors.Black,
    shadowOffset: { width: width * 0, height: width * 0.01 },
    shadowOpacity: width * 0.00025,
    shadowRadius: width * 0.0384,
  },
  pickerTriggerText: {
    color: 'black',
    fontSize: width * 0.035,
  },
 // Chat container, item, and text styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.LightGreen,
  },
  lastMessageText: {
    fontSize: width * 0.035, 
    color: colors.Black, 
    marginTop: width * 0.01, 
    marginBottom: width * 0.02,
    marginLeft: width * 0.025, 
    marginRight: width * 0.025, 
  },
  chatItem: {
    backgroundColor: colors.DarkGreen,
    padding: width * 0.04,
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0,
    marginVertical: width * 0.025, 
    marginHorizontal: width * 0.1, 
    shadowColor: colors.Black,
    shadowOffset: { width: width * 0, height: width * 0.01 },
    shadowOpacity: width * 0.00025,
    shadowRadius: width * 0.0384,
  },
  chatPageContainer: {
    flex: height * 1,
    backgroundColor: colors.LightGreen,
  },
  chatText: {
    fontSize: width * 0.035, 
    color: colors.Black, 
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: width * 0.035, 
    color: colors.Black,
  },


  // Styles for message bubbles in chat
  messageBubbleCommon: {
    padding: width * 0.03,
    borderRadius: width * 0.025,
    marginVertical: width * 0.015, 
    maxWidth: '80%',
  },
  messageBubbleLeft: {
    backgroundColor: colors.White,
    alignSelf: 'flex-start',
    marginLeft: width * 0.025,
  },
  messageBubbleRight: {
    backgroundColor: colors.DarkGreen,
    alignSelf: 'flex-end',
    marginRight: width * 0.025,
  },
  messageTextLeft: {
    color: 'black',
  },
  messageTextRight: {
    color: colors.Black,
  },
  messageRight: {
    justifyContent: 'flex-end',
  },

  messageLeft: {
    justifyContent: 'flex-start',
  },

  senderRight: {
    textAlign: 'right',
  },

  senderLeft: {
    textAlign: 'left',
  },
  
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Styles for sending messages in chat
  inputContainer: {
    justifyContent: 'space-around',
    marginVertical: width * 0.01,
    marginHorizontal: width * 0.03, 
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0004,
    shadowColor: colors.Black,
    shadowOffset: { width: width * 0, height: width * 0.01 },
    shadowOpacity: width * 0.00025,
    shadowRadius: width * 0.0384,
    padding:  width * 0.025, 
    backgroundColor: colors.White
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      flex: 1,
      marginRight: 10,
      fontWeight: 'bold',
    },
    value: {
      flex: 3,
    },
 
  input: {
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.000,
    padding: width * 0.025, 
    backgroundColor: colors.White,
    marginBottom: width * 0.02
  },
  sendButton: {
    backgroundColor: colors.DarkGreen,
    padding: width * 0.025, 
    borderRadius: width * 0.025,
    borderColor: colors.White,
    borderWidth: width * 0.0004,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0.02
  },
  sendButtonText: {
    fontSize: width * 0.035, 
    color: colors.Black ,
  }, 

  stadiumImage: {
    width: width * 0.6, 
    height: width * 0.6, 
    resizeMode: 'cover',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  
  // Overlay styles for additional features
  overlayContainer: {
    padding: width * 0.05,
  },
  overlayContainer2: {
    padding: width * 0.05,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  overlayTitle: {
    fontSize: width * 0.035, 
    fontWeight: 'bold',
    marginBottom: width * 0.05, 
  },
  overlayInput: {
    borderRadius: width * 0.025,
    borderColor: colors.Black,
    borderWidth: width * 0.0004,
    padding: width * 0.05, 
    marginBottom: width * 0.05, 
  },
  HomeContainer: {

    flex: 1,
    backgroundColor: colors.LightGreen,
  },
  Homebutton: {
    marginTop: width * 0, 
    marginBottom: width * 0.1,
    marginHorizontal: width * 0.2, 
  },
  OpponentButton: {
    marginTop: width * 0,
    marginBottom: width * 0.2, 
    marginHorizontal: width * 0.2, 
  },
  HomeButtons: {
    marginTop: width * 0.2, 
  },
  Hometext: {
    fontSize: width * 0.05, 
    color: colors.Black, 
    fontWeight: 'bold',
  },
  RankContainer: {
    flex: 1,
    paddingTop: width * 0.1, 
    backgroundColor: colors.LightGreen
  },
  RankRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignSelf: 'stretch', 
    padding: width * 0.025,
    borderBottomWidth: width * 0.001,
    borderBottomColor: '#D3D3D3', 
    marginHorizontal: width * 0.05,
  },
  RankText: {
    fontSize: width * 0.04, 
    color: colors.Black,
  },
  RankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05, 
    paddingVertical: width * 0.025, 
    backgroundColor: colors.DarkGreen 
  },
  RankHeaderText: {
    fontWeight: 'bold',
  },
});
