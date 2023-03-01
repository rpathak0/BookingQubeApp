/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  I18nManager, 
  Platform
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { withTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import close_image from '../assets/icon/close.png';

class CustomField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custom_fields: [],
      isVisible: false,
    };
  }
  componentDidMount() {
    this.setState({
      custom_fields: this.props.customFieldsData,
    });
  }

  checkIfDataFilled = () => {
    let not_filled = this.state.custom_fields.filter(
      item => item.is_required && !item?.value,
    );
    return not_filled.length;
  };
  onConfirm = () => {
    let obj = {};
    this.state.custom_fields.forEach(item => {
      obj[item.field_name] = item.value ?? '';
      obj['ticket'] = this.props.ticket;
      obj['seat'] = this.props.seat;
    });
    this.props?.onChange?.(obj);
    this.setState({isVisible: false});
  };

  handlePermissions = async (item) => {
    const { t } = this.props;
    try {
      if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            break;
          case RESULTS.GRANTED:
            // console.log("The permission is granted");
            this._selectPhoto(item);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            Alert.alert(
              t('permission_blocked'),
              t('permission_blocked_ie'),
              [
                {
                  text: t('cancel'),
                  style: 'cancel',
                },
                {
                  text: t('ok'),
                  onPress: this.handleOpenSettings,
                },
              ],
              { cancelable: false },
            );
        }
      } else if (Platform.OS === 'ios') {
        this._selectPhoto(item);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  _selectPhoto = async (item) => {
      ImageCropPicker.openPicker({
          width: 512,
          height: 512,
          cropping: true,
          freeStyleCropEnabled: true,
          compressImageQuality: 0.8
      }).then(image => {
          console.log('_selectPhoto', image);
          this._setImageForUpload(image, item);
      });    
  }

  _setImageForUpload = async (image, item) => {
      let localUri = image.path;
      let filename = localUri.split('/').pop();

      // Infer the type of the image
      let type = image.mime;
      
      let av = { uri: localUri, name: filename, type };
      console.log('setImageForUpload', av);
      let newDt = this.state.custom_fields.map(ite => {
        if (ite.id === item.id) {
          return {
            ...ite,
            value: av,
          };
        }
        return ite;
      });
      this.setState({custom_fields: newDt});
  }

  pickFile = async item => {
    try {
      let response = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
      });
      let newDt = this.state.custom_fields.map(ite => {
        if (ite.id === item.id) {
          return {
            ...ite,
            value: response[0],
          };
        }
        return ite;
      });
      this.setState({custom_fields: newDt});
    } catch (e) {
      console.log('err', e);
    }
  };
  renderTextInput = (item, index) => {
    return (
      <View key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        <TextInput
          style={{
            fontSize: wp(3.5),
            flex: 1,
            borderWidth: 2,
            borderRadius: wp(1),
            color: '#000',
            borderColor: '#000',
            height: hp(7),
            paddingLeft: wp(2),
            paddingRight: wp(2),
            marginBottom: hp(1),
            textAlign :  I18nManager.isRTL ? 'right' : 'left',
          }}
          placeholder={item.label + (item.is_required ? ' *' : '')}
          value={item?.value || ''}
          onChangeText={value => {
            // console.log('item',JSON.stringify(item,null,4));
            let newDt = this.state.custom_fields.map(ite => {
              if (ite.id === item.id) {
                return {
                  ...ite,
                  value,
                };
              }
              return ite;
            });
            this.setState({custom_fields: newDt});
          }}
        />
      </View>
    );
  };
  renderTextArea = (item, index) => {
    return (
      <View key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        <TextInput
          multiline={true}
          value={item?.value || ''}
          style={{
            textAlignVertical: 'top',
            fontSize: wp(3.5),
            flex: 1,
            borderWidth: 2,
            borderRadius: wp(1),
            color: '#000',
            borderColor: '#000',
            height: hp(10),
            paddingLeft: wp(2),
            paddingRight: wp(2),
            marginBottom: hp(1),
            textAlign :  I18nManager.isRTL ? 'right' : 'left',
          }}
          placeholder={item.label + (item.is_required ? ' *' : '')}
          onChangeText={value => {
            let newDt = this.state.custom_fields.map(ite => {
              if (ite.id === item.id) {
                return {
                  ...ite,
                  value,
                };
              }
              return ite;
            });
            this.setState({custom_fields: newDt});
          }}
        />
      </View>
    );
  };
  renderDropdown = (item, index) => {
    const {t} = this.props;
    return (
      <View style={{marginBottom: 20}} key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        <RNPickerSelect
          value={item?.value}
          style={{
            inputAndroid: {
              borderColor: 'rgb(220,220,220)',
              borderWidth: 2,
              borderRadius: 5,
              color: '#000',
            },
          }}
          // placeholder={item.label + 'fdkjnf n jk '}
          items={JSON.parse(item.field_options).map((ite, ind) => {
            return {
              label: ite,
              key: ind,
              value: ite,
            };
          })}
          onValueChange={value => {
            let newDt = this.state.custom_fields.map(ite => {
              if (ite.id === item.id) {
                return {
                  ...ite,
                  value,
                };
              }
              return ite;
            });
            this.setState({custom_fields: newDt});
          }}
          placeholder={{label: t('select_item'),value: null}}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    );
  };
  renderRadioInput = (item, index) => {
    let dt = {
      id: 5,
      label: 'Cost',
      field_type: 'radio',
      field_options: [
        '$695 *Weekdays',
        '$895 *Weekends',
        '$100 per hours (additional hours)',
      ],
      field_opt:
        '["$695 *Weekdays","$895 *Weekends","$100 per hours (additional hours)"]',
      is_required: 1,
      event_id: 3,
      status: 1,
      show_on_ticket: 1,
      created_at: '2022-05-25T11:27:49.000000Z',
      updated_at: '2022-05-25T11:27:49.000000Z',
      field_name: 'nWG6GbAgtaK4PQeceD1B',
      file_size: '0',
      file_type: null,
    };
    return (
      <View style={{marginBottom: 20}} key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        {JSON.parse(item.field_options).map((ite, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                let newDt = this.state.custom_fields.map((it, idx) => {
                  if (it.id === item.id) {
                    return {
                      ...it,
                      value: ite,
                    };
                  }
                  return it;
                });
                this.setState({custom_fields: newDt});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <View
                style={[
                  {
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    borderWidth: 1.5,
                    borderColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <View
                  style={[
                    {width: 12, height: 12, borderRadius: 15},
                    item.value === ite
                      ? Styles.activeRadio
                      : Styles.inactiveRadio,
                  ]}
                />
              </View>
              <Text style={{color: '#000'}}> {ite}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  renderCheckboxInput = (item, index) => {
    let dt = {
      id: 5,
      label: 'Cost',
      field_type: 'radio',
      field_options: [
        '$695 *Weekdays',
        '$895 *Weekends',
        '$100 per hours (additional hours)',
      ],
      field_opt:
        '["$695 *Weekdays","$895 *Weekends","$100 per hours (additional hours)"]',
      is_required: 1,
      event_id: 3,
      status: 1,
      show_on_ticket: 1,
      created_at: '2022-05-25T11:27:49.000000Z',
      updated_at: '2022-05-25T11:27:49.000000Z',
      field_name: 'nWG6GbAgtaK4PQeceD1B',
      file_size: '0',
      file_type: null,
    };
    return (
      <View style={{marginBottom: 20}} key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        {JSON.parse(item.field_options).map(ite => {
          return (
            <TouchableOpacity
              key={ite}
              onPress={() => {
                let newDt = this.state.custom_fields.map(it => {
                  if (it.id === item.id) {
                    return {
                      ...it,
                      value: ite,
                    };
                  }
                  return it;
                });
                this.setState({custom_fields: newDt});
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <View
                style={[
                  {
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    borderWidth: 1.5,
                    borderColor: 'black',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <View
                  style={[
                    {width: 12, height: 12, borderRadius: 15},
                    item.value === ite
                      ? Styles.activeRadio
                      : Styles.inactiveRadio,
                  ]}
                />
              </View>
              <Text style={{color: '#000'}}> {ite}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  renderFileInput = (item, index) => {
    const { t } = this.props;
    return (
      <View style={{marginBottom: 10}} key={index}>
        <Text style={{padding: 5, paddingLeft: 0}}>
          {item.label + (item.is_required ? ' *' : '')}
        </Text>
        {!item.value ? (
          <TouchableOpacity
            onPress={() => this.handlePermissions(item)}
            style={{
              backgroundColor: 'rgb(220,220,220)',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              padding: 10,
            }}>
            <Text style={{fontWeight: 'bold', color: 'black'}}>{t('choose_file')}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Image
              source={{uri: item.value.uri}}
              style={{width: 100 + '%', height: 150}}
            />
          </View>
        )}
      </View>
    );
  };
  renderInputBoxes = () => {
    return (
      <View>
        {this.state.custom_fields.map((item, index) => {
          if (item.field_type === 'text') {
            return this.renderTextInput(item, index);
          }
          if (item.field_type === 'radio') {
            return this.renderRadioInput(item, index);
          }
          if (item.field_type === 'checkbox') {
            return this.renderCheckboxInput(item, index);
          }
          if (item.field_type === 'textarea') {
            return this.renderTextArea(item, index);
          }
          if (item.field_type === 'dropdown') {
            return this.renderDropdown(item, index);
          }
          if (item.field_type === 'file') {
            return this.renderFileInput(item, index);
          }
        })}
      </View>
    );
  };
  render() {
    const { t } = this.props;
    return (
      <View>
        <TouchableOpacity onPress={() => {
              this.setState({isVisible: true});
            }}>
        <View
          style={{
            backgroundColor: '#000',
            padding: 10,
            borderRadius: 5,
            marginBottom: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }} 
          >
          <Text
            style={{
              backgroundColor: 'black',
              color: 'white',
            }}>
            {this?.props?.title}
          </Text>
          {this.checkIfDataFilled() ? (
            <Image
              source={require('../assets/icon/info.png')}
              style={{width: 30, height: 30}}
            />
          ) : (
            <Image
              source={require('../assets/icon/check.png')}
              style={{width: 30, height: 30}}
            />
          )}
        </View>
        </TouchableOpacity>
        <Modal visible={this.state.isVisible} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(20,20,20,0.7)',
            }}>
            <View
              style={{
                width: 90 + '%',
                height: 80 + '%',
                backgroundColor: 'white',
                borderRadius:wp(2),
              }}>
              <Toast position='bottom' />
                <TouchableOpacity
                 onPress={()=>{this.setState({isVisible: false})}}
                 style={{alignItems:'flex-end', paddingRight:wp(2),paddingTop:wp(2) }}
                 >
                <Image source={close_image} />
                </TouchableOpacity>
              <ScrollView contentContainerStyle={{padding: 15}}>
                {this.renderInputBoxes()}
                <TouchableOpacity
                  onPress={() => {
                    if (this.checkIfDataFilled()) {
                      Toast.show({
                        text1: t('all_fields_required'),
                      });
                      return;
                    }
                    this.onConfirm();
                  }}
                  style={[
                    {
                      height: hp(6),
                    width: wp(40),
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#000000',
                    borderRadius: wp(4),
                    marginBottom: hp(2),
                    },
                    this.checkIfDataFilled()
                      ? Styles.inactiveButton
                      : Styles.activeButton,
                  ]}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                      padding: 10,
                      color: this.checkIfDataFilled()
                        ? 'rgb(70,70,70)'
                        : 'white',
                    }}>
                    {t('submit')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withTranslation()(CustomField);

const Styles = StyleSheet.create({
  activeRadio: {
    backgroundColor: 'black',
    borderWidth: 1.5,
    borderColor: 'black',
  },
  inactiveRadio: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'rgb(20,20,20)',
  },
  activeButton: {
    width: 100 + '%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
  },
  inactiveButton: {
    width: 100 + '%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
});
