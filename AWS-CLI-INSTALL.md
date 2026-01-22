# AWS CLI Installation - Windows

## Option 1: Download MSI Installer (Easiest)
1. Download: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Run the installer
3. Open a new PowerShell window
4. Verify: `aws --version`

## Option 2: WinGet (If you have Windows Package Manager)
```powershell
winget install Amazon.AWSCLI
```

## Configure AWS CLI After Installation
```bash
aws configure
```
Enter:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: us-east-1
- Default output format: json

---

# Alternative: Use AWS Console Instead

If you don't want to install AWS CLI, you can set up everything via the AWS web console at https://console.aws.amazon.com

See IMPLEMENTATION-AWS-CONSOLE-SETUP.md for step-by-step instructions.
