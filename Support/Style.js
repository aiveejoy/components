import { StyleSheet } from 'react-native';
import Color from 'common/Color';
import { BasicStyles } from 'common';

const styles = StyleSheet.create({
    Title: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingHorizontal: '7%',
        marginTop: '15%',
    },
    StartLeft: {
        alignSelf: 'flex-start',
    },
    Chips: {
        padding: 5,
        borderRadius: 10,
        alignSelf: 'flex-start'
    },
    Card: {
        borderColor: Color.gray,
        borderWidth: 1,
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 90
    },
    TextCard: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSize: 24,
    iconStyle: {
        color: Color.primary,
        paddingLeft: 20,
        paddingRight: 20,
    },
    Caption: {
        fontSize: 10,
        marginRight: 10,
    },
    ButtonContainer: {
        height: 50,
        borderRadius: BasicStyles.btn.borderRadius,
        justifyContent: BasicStyles.btn.justifyContent,
        alignItems: BasicStyles.btn.alignItems,
    },
    ButtonTextStyle: {
        fontSize: BasicStyles.titleText.fontSize,
        color: '#ffffff',
        textAlign: 'center',
    },
    ButtonContainer: {
        height: 50,
        borderRadius: BasicStyles.btn.borderRadius,
        justifyContent: BasicStyles.btn.justifyContent,
        alignItems: BasicStyles.btn.alignItems,
    },
    floatingButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 50,
        backgroundColor: Color.secondary,
        borderRadius: 100,
        color: Color.white
    },
    textFloatingBtn: {
        color: Color.white
    },
    Center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    View: {
        flex: 1,
        borderBottomColor: Color.white,
        borderBottomWidth: 1,
        marginTop: 50
    },
    Type: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 10,
        height: 40,
        backgroundColor: Color.secondary,
    }
});

export default styles;
