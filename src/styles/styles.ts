// styles.js
import { StyleSheet } from 'react-native';
import Colors from '../constant/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.White,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  containerPadding: {
    padding: 20
  },
  backgroundStyle: {
    flex: 1,
    backgroundColor: 'green', // Example background color
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.HeaderTextColor,
  },
  subText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.SubHeaderTextColor
  },

  normalTextContainer: {
    marginBottom: 20,
  },
  normalText: {
    fontSize: 14,
    color: Colors.NormalTextColor,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.Black
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    color: Colors.Black
  },
  bottomNavigationIcon: {

  },
  button: {
    backgroundColor: Colors.defaultColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: '700'
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    justifyContent: 'center'
  },
  label: {
    marginLeft: 8,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    paddingLeft: 10,
    color: Colors.HeaderTextColor
  },
  alertMessage: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: Colors.SubHeaderTextColor
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskCountContainer: {
    marginBottom: 4,
  },
  taskCountText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.LightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#00C853', // Green color for completed progress
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default styles;